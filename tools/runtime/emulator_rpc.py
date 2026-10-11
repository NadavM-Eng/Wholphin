"""Read only the dedicated emulator's short-lived credential; never log it."""
import configparser
import os
from pathlib import Path


def metadata():
    discovery = Path(os.environ["LOCALAPPDATA"]) / "Temp" / "avd" / "running"
    matches = []
    for filename in discovery.glob("pid_*.ini"):
        config = configparser.ConfigParser(interpolation=None)
        try:
            config.read_string("[emulator]\n" + filename.read_text(encoding="utf-8"))
        except (OSError, configparser.Error):
            continue
        values = config["emulator"]
        if values.get("grpc.port") == "8560" and values.get("avd.name") == "WholphinTV36":
            token = values.get("grpc.token")
            if token:
                matches.append(token)
    if len(matches) != 1:
        raise RuntimeError("Start the dedicated emulator with -grpc-use-token before capturing it")
    return [("authorization", "Bearer " + matches[0])]
