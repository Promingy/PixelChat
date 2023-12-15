from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

user_servers = db.Table(
    "user_servers",
    db.Model.metadata,
    db.Column(
        "user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column(
        "server_id", db.Integer, db.ForeignKey("servers.id"), primary_key=True
    )
)
