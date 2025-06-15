from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
from models import db, bcrypt, User
from config import Config
from auth import auth_bp
import jwt

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

db.init_app(app)
bcrypt.init_app(app)
app.register_blueprint(auth_bp)  # Mounted at root, so routes like /login, /register

@app.route("/")
def home():
    return "🎮 MiniGames Auth API running"

@app.route("/users")
def get_users():
    users = [user.username for user in User.query.all()]
    return jsonify(users)

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
        emit("private_message", {"sender": sender, "recipient": recipient, "text": text}, room=room)
    except jwt.ExpiredSignatureError:
        emit("error", {"error": "Token expired"})
    except jwt.InvalidTokenError:
        emit("error", {"error": "Invalid token"})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, port=5000)
