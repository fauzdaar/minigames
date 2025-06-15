# config.py
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "super-secret-key"
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'db.sqlite3')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
