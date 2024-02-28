from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_server import user_servers
from .db import add_prefix_for_prod

class Server(db.Model, UserMixin):
    __tablename__ = 'servers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, default="https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Default-Server-Icon.svg")
    description = db.Column(db.String)

    # relationship attributes
    user = db.relationship("User", back_populates="servers_owner")
    channels = db.relationship("Channel", back_populates="server")
    direct_rooms = db.relationship("DirectRoom", back_populates="server")


    users = db.relationship(
        "User",
        secondary=user_servers,
        back_populates="servers"
    )

    def to_dict(self, channels=False, direct_rooms=False):
        dictionary = {
            'id': self.id,
            'owner_id':self.owner_id,
            'name':self.name,
            'image_url':self.image_url,
            'description':self.description
        }

        # if to_dict is called with Channels=True, load all channels
        if channels:
            # Add all channels to dictionary as a list of dictionaries
            dictionary['channels'] = [channel.to_dict(messages = True) for channel in self.channels]
            dictionary['users'] = [user.to_dict() for user in self.users]

        if direct_rooms:
            dictionary['direct_rooms'] = [direct_room.to_dict(messages = True) for direct_room in self.direct_rooms]

        return dictionary
