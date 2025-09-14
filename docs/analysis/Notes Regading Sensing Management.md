
a clear, modular starting point for your sensory input framework using FastAPI, focusing first on primary inputs. It includes data models, endpoints, and placeholders for normalization and dynamic config/




from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Union
from datetime import datetime

app = FastAPI()

# --- Dynamic Config ---
class SensorConfig(BaseModel):
    sampling_interval_ms: Optional[int] = 800  # default heartbeat
    active: Optional[bool] = True

# Global sensor config (could be extended or loaded from DB/config file)
sensor_config = {
    "mouse": SensorConfig(),
    "keyboard": SensorConfig(),
    "browser": SensorConfig(),
    "clipboard": SensorConfig(),
    "microphone": SensorConfig(sampling_interval_ms=5000, active=False),
    "light_sensor": SensorConfig(sampling_interval_ms=5000, active=False),
}

# --- Data Models ---

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
    details: Optional[dict] = {}

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

# --- Endpoints ---

@app.post("/input/mouse")
async def ingest_mouse(events: List[MouseEvent]):
    # TODO: normalize, compress, store
    return {"received": len(events)}

@app.post("/input/keyboard")
async def ingest_keyboard(events: List[KeyboardEvent]):
    # TODO: normalize, compress, store
    return {"received": len(events)}

@app.post("/input/browser")
async def ingest_browser(events: List[BrowserEvent]):
    # TODO: normalize, compress, store
    return {"received": len(events)}

@app.post("/input/clipboard")
async def ingest_clipboard(event: ClipboardEvent):
    # TODO: normalize, compress, store
    return {"received": 1}

@app.post("/input/microphone")
async def ingest_microphone(event: MicrophoneEvent):
    # TODO: normalize, compress, store
    return {"received": 1}

@app.post("/input/light_sensor")
async def ingest_light_sensor(event: LightSensorEvent):
    # TODO: normalize, compress, store
    return {"received": 1}

# --- Config Endpoints (optional) ---

@app.get("/config/{sensor_name}")
async def get_sensor_config(sensor_name: str):
    config = sensor_config.get(sensor_name)
    if not config:
        raise HTTPException(status_code=404, detail="Sensor config not found")
    return config

@app.post("/config/{sensor_name}")
async def update_sensor_config(sensor_name: str, config: SensorConfig):
    if sensor_name not in sensor_config:
        raise HTTPException(status_code=404, detail="Sensor config not found")
    sensor_config[sensor_name] = config
    return {"status": "updated", "sensor": sensor_name, "config": config}



------------------------

1) Setup database connection pool in backend/main.py

import asyncpg
from fastapi import FastAPI

app = FastAPI()
DATABASE_URL = "postgresql://user:password@localhost:5432/yourdb"

@app.on_event("startup")
async def startup():
    app.state.db = await asyncpg.create_pool(DATABASE_URL)

@app.on_event("shutdown")
async def shutdown():
    await app.state.db.close()


2) Create tables for sensory inputs (example for mouse and keyboard)

CREATE TABLE IF NOT EXISTS mouse_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    x FLOAT NOT NULL,
    y FLOAT NOT NULL,
    button TEXT,
    action TEXT
);

CREATE TABLE IF NOT EXISTS keyboard_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    key TEXT NOT NULL,
    action TEXT NOT NULL,
    repeat BOOLEAN DEFAULT FALSE
);


3) Modify the endpoint handlers to store data

from fastapi import HTTPException

@app.post("/input/mouse")
async def ingest_mouse(events: List[MouseEvent]):
    if not events:
        raise HTTPException(status_code=400, detail="No events received")
    values = [(e.timestamp, e.x, e.y, e.button, e.action) for e in events]
    query = """
        INSERT INTO mouse_events (timestamp, x, y, button, action)
        VALUES ($1, $2, $3, $4, $5)
    """
    async with app.state.db.acquire() as conn:
        async with conn.transaction():
            await conn.executemany(query, values)
    return {"stored": len(events)}

@app.post("/input/keyboard")
async def ingest_keyboard(events: List[KeyboardEvent]):
    if not events:
        raise HTTPException(status_code=400, detail="No events received")
    values = [(e.timestamp, e.key, e.action, e.repeat) for e in events]
    query = """
        INSERT INTO keyboard_events (timestamp, key, action, repeat)
        VALUES ($1, $2, $3, $4)
    """
    async with app.state.db.acquire() as conn:
        async with conn.transaction():
            await conn.executemany(query, values)
    return {"stored": len(events)}


4) Extend similarly for other inputs
Create appropriate tables for browser events, clipboard, microphone, and light sensor data, and write similar insert logic.

----------------------------

1) PostgreSQL Table Schemas

CREATE TABLE IF NOT EXISTS mouse_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    x FLOAT NOT NULL,
    y FLOAT NOT NULL,
    button TEXT,
    action TEXT
);

CREATE TABLE IF NOT EXISTS keyboard_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    key TEXT NOT NULL,
    action TEXT NOT NULL,
    repeat BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS browser_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    event_type TEXT NOT NULL,
    details JSONB
);

CREATE TABLE IF NOT EXISTS clipboard_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    content_type TEXT NOT NULL,
    content_summary TEXT
);

CREATE TABLE IF NOT EXISTS microphone_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    noise_level_db FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS light_sensor_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    ambient_lux FLOAT NOT NULL
);


2 FastAPI Endpoint Handlers
from fastapi import HTTPException
from typing import List

@app.post("/input/mouse")
async def ingest_mouse(events: List[MouseEvent]):
    if not events:
        raise HTTPException(status_code=400, detail="No events received")
    values = [(e.timestamp, e.x, e.y, e.button, e.action) for e in events]
    query = """
        INSERT INTO mouse_events (timestamp, x, y, button, action)
        VALUES ($1, $2, $3, $4, $5)
    """
    async with app.state.db.acquire() as conn:
        async with conn.transaction():
            await conn.executemany(query, values)
    return {"stored": len(events)}

@app.post("/input/keyboard")
async def ingest_keyboard(events: List[KeyboardEvent]):
    if not events:
        raise HTTPException(status_code=400, detail="No events received")
    values = [(e.timestamp, e.key, e.action, e.repeat) for e in events]
    query = """
        INSERT INTO keyboard_events (timestamp, key, action, repeat)
        VALUES ($1, $2, $3, $4)
    """
    async with app.state.db.acquire() as conn:
        async with conn.transaction():
            await conn.executemany(query, values)
    return {"stored": len(events)}

@app.post("/input/browser")
async def ingest_browser(events: List[BrowserEvent]):
    if not events:
        raise HTTPException(status_code=400, detail="No events received")
    values = [(e.timestamp, e.event_type, e.details) for e in events]
    query = """
        INSERT INTO browser_events (timestamp, event_type, details)
        VALUES ($1, $2, $3)
    """
    async with app.state.db.acquire() as conn:
        async with conn.transaction():
            await conn.executemany(query, values)
    return {"stored": len(events)}

@app.post("/input/clipboard")
async def ingest_clipboard(event: ClipboardEvent):
    query = """
        INSERT INTO clipboard_events (timestamp, content_type, content_summary)
        VALUES ($1, $2, $3)
    """
    async with app.state.db.acquire() as conn:
        await conn.execute(query, event.timestamp, event.content_type, event.content_summary)
    return {"stored": 1}

@app.post("/input/microphone")
async def ingest_microphone(event: MicrophoneEvent):
    query = """
        INSERT INTO microphone_events (timestamp, noise_level_db)
        VALUES ($1, $2)
    """
    async with app.state.db.acquire() as conn:
        await conn.execute(query, event.timestamp, event.noise_level_db)
    return {"stored": 1}

@app.post("/input/light_sensor")
async def ingest_light_sensor(event: LightSensorEvent):
    query = """
        INSERT INTO light_sensor_events (timestamp, ambient_lux)
        VALUES ($1, $2)
    """
    async with app.state.db.acquire() as conn:
        await conn.execute(query, event.timestamp, event.ambient_lux)
    return {"stored": 1}



Next Steps
Apply these SQL table creations to your PostgreSQL instance.

Integrate these endpoint handlers into your FastAPI backend.

Confirm DB connection pooling setup in your main.py.

Test ingestion from your client or test scripts with sample JSON payloads.

----------------------

1 Install httpx

pip install httpx


2 Test Script Example

import asyncio
import httpx
from datetime import datetime, timezone

BASE_URL = "http://localhost:8000"  # Adjust if needed

async def test_mouse():
    payload = [
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "x": 123.4,
            "y": 567.8,
            "button": "left",
            "action": "click"
        },
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "x": 130.0,
            "y": 570.0,
            "button": None,
            "action": "move"
        }
    ]
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{BASE_URL}/input/mouse", json=payload)
        print("Mouse response:", r.json())

async def test_keyboard():
    payload = [
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "key": "a",
            "action": "down",
            "repeat": False
        },
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "key": "a",
            "action": "up",
            "repeat": False
        }
    ]
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{BASE_URL}/input/keyboard", json=payload)
        print("Keyboard response:", r.json())

async def test_browser():
    payload = [
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": "focus",
            "details": {"element_id": "input1"}
        }
    ]
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{BASE_URL}/input/browser", json=payload)
        print("Browser response:", r.json())

async def test_clipboard():
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "content_type": "text/plain",
        "content_summary": "Sample clipboard text"
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{BASE_URL}/input/clipboard", json=payload)
        print("Clipboard response:", r.json())

async def test_microphone():
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "noise_level_db": 45.5
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{BASE_URL}/input/microphone", json=payload)
        print("Microphone response:", r.json())

async def test_light_sensor():
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ambient_lux": 300.0
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{BASE_URL}/input/light_sensor", json=payload)
        print("Light sensor response:", r.json())

async def main():
    await test_mouse()
    await test_keyboard()
    await test_browser()
    await test_clipboard()
    await test_microphone()
    await test_light_sensor()

if __name__ == "__main__":
    asyncio.run(main())
	
3) How to run
Start your FastAPI backend locally (e.g., uvicorn backend.main:app --reload).

Run this test script: python test_sensory_inputs.py (or any name you choose).

Observe console output confirming successful storage.

-------------------------------

1 Mouse Events

function sendMouseEvents(events) {
  fetch('http://localhost:8000/input/mouse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events),
  });
}

let mouseBuffer = [];

window.addEventListener('mousemove', e => {
  mouseBuffer.push({
    timestamp: new Date().toISOString(),
    x: e.clientX,
    y: e.clientY,
    button: null,
    action: 'move',
  });
  if (mouseBuffer.length >= 10) { // send in batches of 10
    sendMouseEvents(mouseBuffer);
    mouseBuffer = [];
  }
});

window.addEventListener('mousedown', e => {
  mouseBuffer.push({
    timestamp: new Date().toISOString(),
    x: e.clientX,
    y: e.clientY,
    button: e.button === 0 ? 'left' : e.button === 2 ? 'right' : 'middle',
    action: 'down',
  });
  if (mouseBuffer.length >= 10) {
    sendMouseEvents(mouseBuffer);
    mouseBuffer = [];
  }
});

window.addEventListener('mouseup', e => {
  mouseBuffer.push({
    timestamp: new Date().toISOString(),
    x: e.clientX,
    y: e.clientY,
    button: e.button === 0 ? 'left' : e.button === 2 ? 'right' : 'middle',
    action: 'up',
  });
  if (mouseBuffer.length >= 10) {
    sendMouseEvents(mouseBuffer);
    mouseBuffer = [];
  }
});


2 Clipboard Events

function sendKeyboardEvents(events) {
  fetch('http://localhost:8000/input/keyboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events),
  });
}

let keyboardBuffer = [];

window.addEventListener('keydown', e => {
  keyboardBuffer.push({
    timestamp: new Date().toISOString(),
    key: e.key,
    action: 'down',
    repeat: e.repeat,
  });
  if (keyboardBuffer.length >= 10) {
    sendKeyboardEvents(keyboardBuffer);
    keyboardBuffer = [];
  }
});

window.addEventListener('keyup', e => {
  keyboardBuffer.push({
    timestamp: new Date().toISOString(),
    key: e.key,
    action: 'up',
    repeat: e.repeat,
  });
  if (keyboardBuffer.length >= 10) {
    sendKeyboardEvents(keyboardBuffer);
    keyboardBuffer = [];
  }
});


3 Clipboard Events

async function sendClipboardEvent(contentType, contentSummary) {
  await fetch('http://localhost:8000/input/clipboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      content_type: contentType,
      content_summary: contentSummary,
    }),
  });
}

// Example: listen for paste event
window.addEventListener('paste', e => {
  const text = (e.clipboardData || window.clipboardData).getData('text');
  sendClipboardEvent('text/plain', text.slice(0, 200)); // send snippet max 200 chars
});


4 Browser Events

function sendBrowserEvents(events) {
  fetch('http://localhost:8000/input/browser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(events),
  });
}

window.addEventListener('focus', () => {
  sendBrowserEvents([{
    timestamp: new Date().toISOString(),
    event_type: 'focus',
    details: {},
  }]);
});

window.addEventListener('blur', () => {
  sendBrowserEvents([{
    timestamp: new Date().toISOString(),
    event_type: 'blur',
    details: {},
  }]);
});


