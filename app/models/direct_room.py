from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_channel import user_channels
from datetime import datetime
from .db import add_prefix_for_prod

class DirectRoom(db.Model, UserMixin):
    __tablename__ = 'direct_rooms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("servers.id")))
    owner_1_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")))
    owner_2_id = db.Column(db.Integer,db.ForeignKey(add_prefix_for_prod("users.id")))

    # relationship attributes
    user_1 = db.relationship("User", foreign_keys=[owner_1_id], back_populates="direct_room_owner_1")
    user_2 = db.relationship("User", foreign_keys=[owner_2_id], back_populates="direct_room_owner_2")
    direct_messages = db.relationship("DirectMessage", back_populates="direct_room")
    server = db.relationship("Server", back_populates="direct_rooms")


    def to_dict(self, offset=0, direct_messages=False, server=False):
        dictionary = {
            'id': self.id,
            'server_id':self.server_id,
            'owner_1_id':self.owner_1_id,
            'owner_2_id':self.owner_2_id,
        }
        # if messages=True, add amount of messages equal to 'limit' to dictionary.
        if direct_messages:
            # runs sorting lambda that sorts by Year, Month, Day, Hour, Minute, Second and adds list of messages to the dictionary
            dictionary['direct_messages'] = sorted([direct_message.to_dict() for direct_message in self.direct_messages], key=lambda msg: datetime(msg['created_at'].year, msg['created_at'].month, msg['created_at'].day, msg['created_at'].hour, msg['created_at'].minute, msg['created_at'].second), reverse=True)[offset : offset + 15]
        if server:
            dictionary['server'] = self.server
        return dictionary
