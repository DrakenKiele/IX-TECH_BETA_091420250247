
"""
CLI entry point for Aniota: Celestial Campaign
Allows local play and debugging. Easily extendable for web API or Electron overlay.
"""
from core_game.game_engine import GameEngine

class DummyPlayer:
    def update_stats(self):
        print("Player stats updated.")

class DummySector:
    def resolve_events(self):
        print("Sector events resolved.")

class DummyNPCManager:
    def process_tasks(self):
        print("NPC tasks processed.")

def main():
    print("Aniota: Celestial Campaign CLI")
    players = [DummyPlayer() for _ in range(2)]
    sectors = [DummySector() for _ in range(3)]
    npc_manager = DummyNPCManager()
    engine = GameEngine(players, sectors, npc_manager)
    while True:
        cmd = input("Enter command (turn/quit): ").strip().lower()
        if cmd == "turn":
            engine.run_turn()
            print(f"Turn {engine.turn_count} complete.")
        elif cmd == "quit":
            print("Exiting game.")
            break
        else:
            print("Unknown command.")

if __name__ == "__main__":
    main()
