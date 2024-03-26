from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .db import add_prefix_for_prod


class DirectReaction(db.Model, UserMixin):
    __tablename__ = 'direct_reactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("direct_messages.id")))
    emoji = db.Column(db.String)

    # relationship attributes
    user = db.relationship("User", back_populates="direct_reactions")
    direct_message = db.relationship("DirectMessage", back_populates="reactions")

    def to_dict(self):
        return{
            'id':self.id,
            'user_id':self.user_id,
            'message_id':self.message_id,
            'emoji':self.emoji
        }
