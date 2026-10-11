"""Control and capture the dedicated emulator through its published gRPC API."""
import argparse
import array
import json
from pathlib import Path
import sys
import time
import wave

import grpc
from emulator_rpc import metadata

ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / ".research-cache" / "runtime"
sys.path.insert(0, str(RUNTIME))
import emulator_controller_pb2 as pb
import emulator_controller_pb2_grpc as rpc

parser = argparse.ArgumentParser()
parser.add_argument("command", choices=["screenshot", "key", "text", "mouse", "audio"])
parser.add_argument("arguments", nargs="*")
args = parser.parse_args()
stub = rpc.EmulatorControllerStub(grpc.insecure_channel("127.0.0.1:8560"))
auth = metadata()

if args.command == "screenshot":
    name = args.arguments[0] if args.arguments else "grpc-current.png"
    image = stub.getScreenshot(pb.ImageFormat(format=pb.ImageFormat.PNG), metadata=auth, timeout=5)
    (RUNTIME / name).write_bytes(image.image)
    print(json.dumps({"file": name, "bytes": len(image.image), "width": image.format.width, "height": image.format.height}))
elif args.command == "key":
    stub.sendKey(pb.KeyboardEvent(key=args.arguments[0], eventType=pb.KeyboardEvent.keypress), metadata=auth, timeout=5)
elif args.command == "text":
    stub.sendKey(pb.KeyboardEvent(text=args.arguments[0]), metadata=auth, timeout=5)
elif args.command == "mouse":
    x, y = (int(value) for value in args.arguments[:2])
    stub.sendMouse(pb.MouseEvent(x=x, y=y, buttons=1), metadata=auth, timeout=5)
    time.sleep(0.06)
    stub.sendMouse(pb.MouseEvent(x=x, y=y, buttons=0), metadata=auth, timeout=5)
elif args.command == "audio":
    duration = float(args.arguments[0]) if args.arguments else 3
    name = args.arguments[1] if len(args.arguments) > 1 else "emulator-audio.wav"
    chunks = []
    timestamps = []
    start = time.monotonic()
    stream = stub.streamAudio(pb.AudioFormat(samplingRate=48000, channels=pb.AudioFormat.Stereo, format=pb.AudioFormat.AUD_FMT_S16, mode=pb.AudioFormat.MODE_REAL_TIME), metadata=auth, timeout=duration + 8)
    for packet in stream:
        chunks.append(packet.audio)
        timestamps.append(packet.timestamp)
        if time.monotonic() - start >= duration:
            stream.cancel()
            break
    pcm = b"".join(chunks)
    with wave.open(str(RUNTIME / name), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(48000)
        output.writeframes(pcm)
    samples = array.array("h", pcm)
    rms = (sum(value * value for value in samples) / max(1, len(samples))) ** 0.5
    result = {"file": name, "sample_rate": 48000, "channels": 2, "pcm_bytes": len(pcm), "packets": len(chunks), "rms_s16": round(rms, 2), "nonzero_samples": sum(value != 0 for value in samples), "capture_wall_seconds": round(time.monotonic() - start, 3), "packet_span_seconds": round((timestamps[-1] - timestamps[0]) / 1e6, 3) if len(timestamps) > 1 else 0}
    (RUNTIME / (name + ".json")).write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result))
