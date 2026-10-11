"""Probe only the dedicated local emulator; never print its authentication token."""
import json
from pathlib import Path
import sys

import grpc
from google.protobuf.empty_pb2 import Empty
from emulator_rpc import metadata as emulator_metadata

ROOT = Path(__file__).resolve().parents[2]
RUNTIME = ROOT / ".research-cache" / "runtime"
sys.path.insert(0, str(RUNTIME))
import emulator_controller_pb2 as pb
import emulator_controller_pb2_grpc as rpc

metadata = emulator_metadata()
print(json.dumps({"token_present": True, "port": 8560}))

channel = grpc.insecure_channel("127.0.0.1:8560")
stub = rpc.EmulatorControllerStub(channel)
try:
    try:
        stub.getScreenshot(pb.ImageFormat(format=pb.ImageFormat.PNG), timeout=2)
    except grpc.RpcError as error:
        if error.code() not in {grpc.StatusCode.UNAUTHENTICATED, grpc.StatusCode.PERMISSION_DENIED}:
            raise
        print(json.dumps({"unauthenticated_capture": "rejected", "status": error.code().name}))
    else:
        raise RuntimeError("Emulator capture unexpectedly accepts unauthenticated requests")
    status = stub.getStatus(Empty(), metadata=metadata, timeout=5)
    print(json.dumps({"grpc_status": "connected", "version": status.version, "uptime": status.uptime}))
    image = stub.getScreenshot(pb.ImageFormat(format=pb.ImageFormat.PNG), metadata=metadata, timeout=5)
    (RUNTIME / "grpc-screenshot.png").write_bytes(image.image)
    print(json.dumps({"screenshot_bytes": len(image.image), "width": image.format.width, "height": image.format.height}))
    print(json.dumps({"audio_format_fields": [field.name for field in pb.AudioFormat.DESCRIPTOR.fields], "keyboard_fields": [field.name for field in pb.KeyboardEvent.DESCRIPTOR.fields]}))
except grpc.RpcError as error:
    print(json.dumps({"grpc_status": error.code().name, "detail": error.details()}))
    sys.exit(1)
