
"""
FastAPI entry point for Aniota: Celestial Campaign
Exposes the game engine for web, Electron, and PWA overlays.
"""
from fastapi import FastAPI
from core_game.game_engine import GameEngine
from pydantic import BaseModel

class DummyPlayer:
    def update_stats(self):
        pass
class DummySector:
    def resolve_events(self):
        pass
class DummyNPCManager:
    def process_tasks(self):
        pass

app = FastAPI(title="Aniota: Celestial Campaign API")

players = [DummyPlayer() for _ in range(2)]
sectors = [DummySector() for _ in range(3)]
npc_manager = DummyNPCManager()
engine = GameEngine(players, sectors, npc_manager)

class CommandRequest(BaseModel):
    command: str

@app.post("/command")
def run_command(req: CommandRequest):
    if req.command == "turn":
        engine.run_turn()
        return {"status": "ok", "turn": engine.turn_count}
    return {"status": "error", "message": "Unknown command"}

@app.get("/state")
def get_state():
    # Replace with real state serialization
    return {"turn": engine.turn_count}
