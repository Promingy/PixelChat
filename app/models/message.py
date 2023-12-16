from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class Message(db.Model, UserMixin):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    channel_id = db.Column(db.Integer, db.ForeignKey("channels.id"))
    body = db.Column(db.String)
    pinned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.Date)

    # relationship attributes
    reactions = db.relationship("Reaction", back_populates="message")
    user = db.relationship("User", back_populates="messages")
    channel = db.relationship("Channel", back_populates="messages")


    def to_dict(self):
        return {
            'id': self.id,
            'user_id':self.user_id,
            'channel_id':self.channel_id,
            'body':self.body,
            'pinned':self.pinned,
            'created_at':self.created_at
        }
