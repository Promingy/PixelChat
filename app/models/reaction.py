from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .db import add_prefix_for_prod


class Reaction(db.Model, UserMixin):
    __tablename__ = 'reactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("messages.id")))
    emoji = db.Column(db.String)

    # relationship attributes
    user = db.relationship("User", back_populates="reactions")
    message = db.relationship("Message", back_populates="reactions")

    def to_dict(self):
        return{
            'id':self.id,
            'user_id':self.user_id,
            'message_id':self.message_id,
            'emoji':self.emoji
        }
