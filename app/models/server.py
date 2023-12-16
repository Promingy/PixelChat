from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .user_server import user_servers

class Server(db.Model, UserMixin):
    __tablename__ = 'servers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)
    description = db.Column(db.String)

    # relationship attributes
    user = db.relationship("User", back_populates="servers_owner")
    channels = db.relationship("Channel", back_populates="server")    

    users = db.relationship(
        "Server",
        secondary=user_servers,
        back_populates="servers"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id':self.owner_id,
            'name':self.name,
            'image_url':self.image_url,
            'description':self.description
        }
