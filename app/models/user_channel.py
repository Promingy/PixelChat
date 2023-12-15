from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

user_channels = db.Table(
    "user_channels",
    db.Model.metadata,
    db.Column(
        "user_id", db.Integer, db.ForeignKey("users.id", primary_key=True)
    ),
    db.Column(
        "channel_id", db.Integer, db.ForeignKey("channels.id", primary_key=True)
    )
)
