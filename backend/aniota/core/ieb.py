

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("ieb.py", "system_initialization", "import", "Auto-generated dev log entry")

Input Event Buffer (IEB) for Aniota
- Buffers sensor snapshots every 5 seconds (default)
- Each recording costs Aniota 1 point
- Snapshots are written to a session meta file in JSON
- Sensors are modular and can be registered
- Sampling interval and device selection are adjustable
"""
import time
import json
from threading import Thread, Event

class InputEventBuffer:
    def __init__(self, sensors=None, sampling_interval=5, meta_filename="ieb_meta.json"):
        self.sensors = sensors if sensors else []
        self.sampling_interval = sampling_interval
        self.meta_filename = meta_filename
        self.buffer = []
        self.running = False
        self.stop_event = Event()
        self.aniota_points = 100  # Starting points, adjustable

    def register_sensor(self, sensor):
        self.sensors.append(sensor)

    def sample_sensors(self):
        snapshot = {
            "timestamp": time.time(),
            "sensors": {}
        }
        for sensor in self.sensors:
            try:
                state = sensor.get_state()
                snapshot["sensors"][sensor.name] = state
                self.aniota_points -= 1  # Each recording costs 1 point
            except Exception as e:
                snapshot["sensors"][sensor.name] = f"error: {str(e)}"
        self.buffer.append(snapshot)
        self.write_to_meta_file(snapshot)

    def write_to_meta_file(self, snapshot):
        try:
            with open(self.meta_filename, "a", encoding="utf-8") as f:
                f.write(json.dumps(snapshot) + "\n")
        except Exception:
            pass  # Logging can be added here

    def start(self):
        self.running = True
        self.stop_event.clear()
        Thread(target=self._run, daemon=True).start()

    def stop(self):
        self.running = False
        self.stop_event.set()

    def _run(self):
        while self.running and not self.stop_event.is_set():
            self.sample_sensors()
            time.sleep(self.sampling_interval)

class Sensor:
    def __init__(self, name):
        self.name = name
    
    def get_state(self):
        return "dummy_state"
