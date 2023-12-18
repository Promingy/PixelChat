from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_channel import user_channels
from datetime import datetime

class Channel(db.Model, UserMixin):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey("servers.id"))
    owner_id = db.Column(db.Integer,db.ForeignKey("users.id"))
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    topic = db.Column(db.String)

    # relationship attributes
    user = db.relationship("User", back_populates="channels_owner")
    messages = db.relationship("Message", back_populates="channel")
    server = db.relationship("Server", back_populates="channels")

    users = db.relationship(
        "User",
        secondary=user_channels,
        back_populates="channels"
    )



    def to_dict(self, messages=False, limit=25):
        dictionary = {
            'id': self.id,
            'server_id':self.server_id,
            'owner_id':self.owner_id,
            'name':self.name,
            'description':self.description,
            'topic':self.topic
        }

        if messages:
            dictionary['messages'] = sorted([message.to_dict(reactions=True) for message in self.messages], key=lambda msg: datetime(msg['created_at'].year, msg['created_at'].month, msg['created_at'].day, msg['created_at'].hour, msg['created_at'].minute, msg['created_at'].second))

        return dictionary
