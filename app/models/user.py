from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_server import user_servers
from .user_channel import user_channels


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
    image_url = db.Column(db.String, default="https://www.wadadaleosmith.com/wp-content/uploads/2017/09/demo-image-user-800x1200.jpg")
    email = db.Column(db.String(255), nullable=False, unique=True)
    theme = db.Column(db.String, default="default")
    hashed_password = db.Column(db.String(255), nullable=False)

    # relationship attributes
    servers_owner = db.relationship("Server", back_populates="user")

    channels_owner = db.relationship("Channel", back_populates="user")

    reactions = db.relationship("Reaction", back_populates="user")

    messages = db.relationship("Message", back_populates="user")

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
            'servers': [server.to_dict() for server in self.servers]
            # 'servers': dict(self.servers)
            # 'servers': self.servers.to_dict()
                # get Error (InstrumentedList object has no attribute 'to_dict')
        }
        return dict1
