"""Local WebRTC viewer for the unchanged Android app using emulator capture APIs."""
import asyncio
from fractions import Fraction
import json
import logging
from pathlib import Path
import sys
import time

from aiohttp import web
from aiortc import AudioStreamTrack, VideoStreamTrack, RTCPeerConnection, RTCSessionDescription, RTCConfiguration
from av import AudioFrame, VideoFrame
import grpc
from emulator_rpc import metadata

ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / ".research-cache" / "runtime"
sys.path.insert(0, str(RUNTIME))
import emulator_controller_pb2 as pb
import emulator_controller_pb2_grpc as rpc

logging.basicConfig(level=logging.WARNING)
peers = set()
tracks = {}
stats = {"video_frames": 0, "audio_frames": 0, "audio_silence_frames": 0, "audio_dropped_chunks": 0, "capture_errors": 0, "control_requests": 0}
CHANNEL_OPTIONS = [("grpc.max_receive_message_length", 16 * 1024 * 1024)]


class ScreenTrack(VideoStreamTrack):
    def __init__(self, clock):
        super().__init__()
        self.clock = clock
        self.channel = grpc.insecure_channel("127.0.0.1:8560", options=CHANNEL_OPTIONS)
        self.stub = rpc.EmulatorControllerStub(self.channel)
        self.auth = metadata()
        self.last = 0.0

    async def recv(self):
        delay = max(0, self.last + 1 / 30 - time.monotonic())
        if delay:
            await asyncio.sleep(delay)
        self.last = time.monotonic()
        image = await asyncio.to_thread(self.stub.getScreenshot, pb.ImageFormat(format=pb.ImageFormat.RGBA8888, width=1280, height=720), metadata=self.auth, timeout=3)
        width, height = image.format.width, image.format.height
        frame = VideoFrame(width, height, "rgba")
        # The native framebuffer may have a padded row stride.
        plane = frame.planes[0]
        row_bytes = width * 4
        if plane.line_size == row_bytes:
            plane.update(image.image)
        else:
            padded = bytearray(plane.buffer_size)
            for row in range(height):
                padded[row * plane.line_size:row * plane.line_size + row_bytes] = image.image[row * row_bytes:(row + 1) * row_bytes]
            plane.update(padded)
        frame.time_base = Fraction(1, 90000)
        capture_us = image.timestampUs or time.time_ns() // 1000
        frame.pts = max(0, int((capture_us - self.clock) * 90000 / 1e6))
        stats["video_frames"] += 1
        stats["last_video_capture_us"] = capture_us
        return frame

    def stop(self):
        super().stop()
        self.channel.close()


class OutputAudioTrack(AudioStreamTrack):
    def __init__(self, clock):
        super().__init__()
        self.clock = clock
        self.channel = grpc.insecure_channel("127.0.0.1:8560", options=CHANNEL_OPTIONS)
        self.stub = rpc.EmulatorControllerStub(self.channel)
        self.stream = self.stub.streamAudio(pb.AudioFormat(samplingRate=48000, channels=pb.AudioFormat.Stereo, format=pb.AudioFormat.AUD_FMT_S16, mode=pb.AudioFormat.MODE_REAL_TIME), metadata=metadata())
        self.loop = asyncio.get_running_loop()
        # The emulator stops emitting PCM when the app pauses. Keep a continuous
        # RTP clock with silence, and bound the queue to 100 ms of captured audio.
        self.queue = asyncio.Queue(maxsize=5)
        self.next_pts = max(0, int((time.time_ns() // 1000 - clock) * 48000 / 1e6))
        self.deadline = time.monotonic()
        self.capture_task = asyncio.create_task(asyncio.to_thread(self.capture))

    def enqueue(self, data, timestamp):
        if self.readyState != "live":
            return
        if self.queue.full():
            self.queue.get_nowait()
            stats["audio_dropped_chunks"] += 1
        self.queue.put_nowait(data)
        stats["last_audio_capture_us"] = timestamp

    def capture(self):
        pending = bytearray()
        required = 960 * 2 * 2
        try:
            for packet in self.stream:
                pending.extend(packet.audio)
                while len(pending) >= required:
                    data = bytes(pending[:required])
                    del pending[:required]
                    self.loop.call_soon_threadsafe(self.enqueue, data, packet.timestamp)
        except grpc.RpcError:
            if self.readyState == "live":
                self.loop.call_soon_threadsafe(self.capture_failed)

    def capture_failed(self):
        stats["capture_errors"] += 1

    async def recv(self):
        delay = self.deadline - time.monotonic()
        if delay > 0:
            await asyncio.sleep(delay)
        self.deadline += 0.02
        # Do not send a burst after the event loop has been delayed.
        if self.deadline < time.monotonic() - 0.1:
            self.deadline = time.monotonic() + 0.02
            self.next_pts = max(self.next_pts, int((time.time_ns() // 1000 - self.clock) * 48000 / 1e6))
        try:
            data = self.queue.get_nowait()
        except asyncio.QueueEmpty:
            data = bytes(960 * 2 * 2)
            stats["audio_silence_frames"] += 1
        frame = AudioFrame(format="s16", layout="stereo", samples=960)
        frame.planes[0].update(data)
        frame.sample_rate = 48000
        frame.time_base = Fraction(1, 48000)
        frame.pts = self.next_pts
        self.next_pts += 960
        stats["audio_frames"] += 1
        return frame

    def stop(self):
        super().stop()
        self.stream.cancel()
        self.channel.close()
        self.capture_task.cancel()


async def close_peer(pc):
    peers.discard(pc)
    for track in tracks.pop(pc, []):
        track.stop()
    await pc.close()


async def native_control(message):
    allowed = {"key", "tap", "text", "scroll", "tree", "activate"}
    if message.get("command") not in allowed:
        return {"ok": False, "error": "Unsupported control"}
    reader, writer = await asyncio.open_connection("127.0.0.1", 18666)
    try:
        writer.write((json.dumps(message) + "\n").encode("utf-8"))
        await writer.drain()
        result = json.loads(await asyncio.wait_for(reader.readline(), 5))
        stats["control_requests"] += 1
        return result
    finally:
        writer.close()
        await writer.wait_closed()


@web.middleware
async def local_only(request, handler):
    allowed = {"http://127.0.0.1:18765", "http://localhost:18765"}
    if request.host not in {"127.0.0.1:18765", "localhost:18765"}:
        raise web.HTTPForbidden()
    origin = request.headers.get("Origin")
    if origin and origin not in allowed:
        raise web.HTTPForbidden()
    return await handler(request)


async def index(request):
    return web.FileResponse(ROOT / "tools" / "runtime" / "viewer.html", headers={"Cache-Control": "no-store"})


async def offer(request):
    data = await request.json()
    if len(data.get("sdp", "")) > 65536:
        raise web.HTTPBadRequest()
    # One viewer controls this one dedicated emulator.
    for old in list(peers):
        await close_peer(old)
    pc = RTCPeerConnection(RTCConfiguration(iceServers=[]))
    peers.add(pc)
    clock = time.time_ns() // 1000

    @pc.on("connectionstatechange")
    async def state_changed():
        if pc.connectionState in {"failed", "closed"}:
            await close_peer(pc)

    @pc.on("datachannel")
    def data_channel(channel):
        @channel.on("message")
        def message_received(raw):
            async def respond():
                try:
                    message = json.loads(raw)
                    started = time.monotonic()
                    result = await native_control(message)
                    result["id"] = message.get("id")
                    result["elapsed_ms"] = round((time.monotonic() - started) * 1000, 1)
                    if channel.readyState == "open":
                        channel.send(json.dumps(result))
                except Exception:
                    if channel.readyState == "open":
                        channel.send(json.dumps({"ok": False, "error": "Control unavailable"}))
            asyncio.create_task(respond())

    await pc.setRemoteDescription(RTCSessionDescription(sdp=data["sdp"], type=data["type"]))
    tracks[pc] = [ScreenTrack(clock), OutputAudioTrack(clock)]
    for track in tracks[pc]:
        pc.addTrack(track)
    await pc.setLocalDescription(await pc.createAnswer())
    return web.json_response({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type})


async def health(request):
    return web.json_response({"viewer": "Wholphin Android runtime", "connections": len(peers), **stats})


async def control(request):
    return web.json_response(await native_control(await request.json()))


async def shutdown(app):
    await asyncio.gather(*(close_peer(pc) for pc in list(peers)), return_exceptions=True)


app = web.Application(middlewares=[local_only], client_max_size=128 * 1024)
app.router.add_get("/", index)
app.router.add_post("/offer", offer)
app.router.add_get("/health", health)
app.router.add_post("/control", control)
app.on_shutdown.append(shutdown)

if __name__ == "__main__":
    web.run_app(app, host="127.0.0.1", port=18765, print=lambda message: print("Wholphin viewer: http://127.0.0.1:18765", flush=True))
