
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/player_action", methods=["POST"])
def player_action():
    data = request.json
    # Example: {"player_id":1, "action":"assign_task", "target":"sector_2"}
    result = handle_player_action(data)
    return jsonify(result)

@app.route("/get_state", methods=["GET"])
def get_state():
    return jsonify(get_game_state())

def handle_player_action(data):
    # Placeholder: integrate with GameEngine and core logic
    return {"status": "success"}

def get_game_state():
    # Placeholder: serialize backend state for frontend
    return {"sectors": [], "players": []}

if __name__ == "__main__":
    app.run(port=5000)
