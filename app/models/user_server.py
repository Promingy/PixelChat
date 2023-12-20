from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .db import add_prefix_for_prod

user_servers = db.Table(
    "user_servers",
    db.Model.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column(
        "user_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"))),
    db.Column(
        "server_id", db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id"))
    )
)

if environment == "production":
    user_servers.schema = SCHEMA
