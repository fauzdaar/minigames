from flask import Blueprint, request, jsonify
from models import db, User
import jwt
from config import Config
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 409

    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        payload = {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(days=1)
        }
        token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")
        return jsonify({"token": token, "username": user.username})

    return jsonify({"error": "Invalid credentials"}), 401
