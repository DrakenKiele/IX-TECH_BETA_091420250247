



import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("models.py", "system_initialization", "import", "Auto-generated dev log entry")

from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime



class SensorConfig(BaseModel):
    sampling_interval_ms: Optional[int] = 800  # default heartbeat
    active: Optional[bool] = True

sensor_config = {
    "mouse": SensorConfig(),
    "keyboard": SensorConfig(),
    "browser": SensorConfig(),
    "clipboard": SensorConfig(),
    "microphone": SensorConfig(sampling_interval_ms=5000, active=False),
    "light_sensor": SensorConfig(sampling_interval_ms=5000, active=False),
}
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime


class MouseEvent(BaseModel):
    timestamp: datetime
    x: float
    y: float
    button: Optional[str] = None  # e.g., 'left', 'right'
    action: Optional[str] = None  # 'move', 'click', 'down', 'up'


class KeyboardEvent(BaseModel):
    timestamp: datetime
    key: str
    action: str  # 'down', 'up'
    repeat: Optional[bool] = False


class BrowserEvent(BaseModel):
    timestamp: datetime
    event_type: str  # e.g., 'focus', 'blur', 'scroll'
    details: Optional[Dict] = {}


class ClipboardEvent(BaseModel):
    timestamp: datetime
    content_type: str  # e.g., 'text/plain'
    content_summary: Optional[str] = None  # optional snippet or hash


class MicrophoneEvent(BaseModel):
    timestamp: datetime
    noise_level_db: float  # abstracted noise level, not raw audio


class LightSensorEvent(BaseModel):
    timestamp: datetime
    ambient_lux: float
