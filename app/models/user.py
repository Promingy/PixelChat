from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_server import user_servers
from .user_channel import user_channels
from .direct_room import DirectRoom


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    bio = db.Column(db.String)
    location = db.Column(db.String)
    image_url = db.Column(db.String, default="https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/demo_user.jpeg")
    email = db.Column(db.String(255), nullable=False, unique=True)
    theme = db.Column(db.String, default="default")
    hashed_password = db.Column(db.String(255), nullable=False)

    # relationship attributes
    servers_owner = db.relationship("Server", back_populates="user")

    channels_owner = db.relationship("Channel", back_populates="user")

    direct_room_owner_1 = db.relationship("DirectRoom", foreign_keys=[DirectRoom.owner_1_id], back_populates="user_1")

    direct_room_owner_2 = db.relationship("DirectRoom", foreign_keys=[DirectRoom.owner_2_id], back_populates="user_2")

    reactions = db.relationship("Reaction", back_populates="user")

    direct_reactions = db.relationship("DirectReaction", back_populates="user")

    messages = db.relationship("Message", back_populates="user")

    direct_messages = db.relationship("DirectMessage", back_populates="user")

    servers = db.relationship(
        "Server",
        secondary=user_servers,
        back_populates="users"
    )

    channels = db.relationship(
        "Channel",
        secondary=user_channels,
        back_populates="users"
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        if password == 'OAUTH':
            self.hashed_password = 'OAUTH'
            return
        else:
            self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        dict1 = {
            'id': self.id,
            'first_name':self.first_name,
            'last_name':self.last_name,
            'username': self.username,
            'bio':self.bio,
            'location':self.location,
            'image_url':self.image_url,
            'email':self.email,
            'theme':self.theme,
            'servers': { server.to_dict()['id']: server.to_dict() for server in self.servers }
            # 'servers': dict(self.servers)
            # 'servers': self.servers.to_dict()
                # get Error (InstrumentedList object has no attribute 'to_dict')
        }
        return dict1
