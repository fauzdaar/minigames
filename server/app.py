from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
from config import Config
from auth import auth_bp
import jwt
import json
import os

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

app.register_blueprint(auth_bp)

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

@app.route("/")
def home():
    return "🎮 MiniGames Auth API running"

@app.route("/users")
def get_users():
    users = load_users()
    return jsonify([user["username"] for user in users])

@socketio.on("join")
def on_join(data):
    username = data["username"]
    room = data["room"]
    join_room(room)
    emit("message", {"username": "System", "text": f"{username} joined the room."}, room=room)

@socketio.on("private_message")
def handle_private_message(data):
    token = data.get("token")
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
        sender = data["sender"]
        recipient = data["recipient"]
        text = data["text"]
        room = f"dm_{min(sender, recipient)}_{max(sender, recipient)}"

        # 👇 This line ensures the sender doesn't receive the message again
        emit("private_message", {
            "sender": sender,
            "recipient": recipient,
            "text": text
        }, room=room, include_self=False)

    except jwt.ExpiredSignatureError:
        emit("error", {"error": "Token expired"})
    except jwt.InvalidTokenError:
        emit("error", {"error": "Invalid token"})

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000)
