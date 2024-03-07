from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.sql import func

from .db import add_prefix_for_prod

class DirectMessage(db.Model, UserMixin):
    __tablename__ = 'direct_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    direct_room_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("direct_rooms.id")))
    body = db.Column(db.String)
    pinned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())

    # relationship attributes
    reactions = db.relationship("DirectReaction", back_populates="direct_message")
    user = db.relationship("User", back_populates="direct_messages")
    direct_room = db.relationship("DirectRoom", back_populates="direct_messages")


    def to_dict(self, reactions=True):
        dictionary = {
            'id': self.id,
            'user_id':self.user_id,
            'direct_room_id':self.direct_room_id,
            'body':self.body,
            'pinned':self.pinned,
            'created_at':self.created_at
        }
        # If reactions=True grab all of the reactions for every message and add to dictionary
        if reactions:
            dictionary['reactions'] = [reaction.to_dict() for reaction in self.reactions]

        return dictionary
