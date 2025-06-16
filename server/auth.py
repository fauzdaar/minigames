from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from datetime import datetime, timedelta
import jwt
import json
import os

auth_bp = Blueprint("auth", __name__)

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    users = load_users()
    if any(user["username"] == username for user in users):
        return jsonify({"error": "User already exists"}), 409

    password_hash = generate_password_hash(password)
    users.append({
        "id": len(users) + 1,
        "username": username,
        "password_hash": password_hash
    })
    save_users(users)

    return jsonify({"message": "Registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    users = load_users()
    user = next((u for u in users if u["username"] == username), None)

    if user and check_password_hash(user["password_hash"], password):
        payload = {
            "user_id": user["id"],
            "exp": datetime.utcnow() + timedelta(days=1)
        }
        token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")
        return jsonify({"token": token, "username": user["username"]})

    return jsonify({"error": "Invalid credentials"}), 401
