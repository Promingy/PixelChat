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
    image_url = db.Column(db.String, default="https://pixel-chat-image-bucket.s3.us-west-1.amazonaws.com/Default_Server_Image.svg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMSJHMEUCIQDPdS%2BefXZdp9FbxUNHyICmyFP9y1NNZI9befAVOFfAnwIgQFjgaE2rn07B1DdxctJ8S8%2BhuB91Cd64JK7y%2FuXwsJwq5AIIMRAAGgwwNTU4Njg2NTI4NTQiDGV9jbQG6qizrU3ZxSrBAvsaXviSSClP8Iz2XE9Ygb3cTuC3M0hI7%2BcUJBNusK38sWRCDTury0Ft2kKucoJXVbBPRZXISXxj0zHd0EB2%2FFk7Iwr27%2FHmIM1E1YuMmPgFi%2BT5wjyLKEc%2Bw2pUcs6v%2BZrj%2BAKgn5GFCJI4BkhtR6d0W%2Bx8ldeXnR8bDjwz72UdZF9aoUFN7r4PT3wrzztinQ6obV%2BLzCYDuCoyz%2FsbRe9aW3kI92%2BMxX2KftVK9KT3X4BuUd9VfdapA%2BTt0CopaEaD2ibHboJFtOwX8nLaFu0o7xw2Qz%2BSfa0fQ7i2Wj2j4EIcjTjirsKj5Fnh0cryc3go1N9efodOCeOZdrGyjU8EVcrgro3%2BJCbXDfXoGSJdPEjobYWxlK7hgGtwQYb%2FbfF%2Bk2FRk68tpcEwVHbvOJDk%2FX8L6V1fBgOCrT6a7ZahvzDo5ZasBjqzAk3J6mEXXJkZ46XR70Mt%2BjlD%2FjPJPUqUEU%2BcvqWDVFLdWD%2BcfAT00m%2BMwsPZYIl4yVnLD0obq%2BeS7eHxse1Hloua0iJx3AWuoK%2BwLn%2FM2lPZuS2%2Fx2g7ab8E6JLJQSKTwxDfeewJnr6cyDzDaFVht6bp5DmC8GoHvfjasRjTwEsqtMKZ53LkXd54V4JS2VSv4eprh9OPr3ttm%2BXyoVPBhr5Rr8eefCWkE73hwRXC5zJyku5fB%2F5LQWGA5HOUS2Csn1YJRjHW1VoY8318VviOpJwmgru63EftWigEqkGmBamo04z81laAd8HniHlLL9ONoMl4obgWLs4vzRUc%2B8wXXQo55DHV0ikzBWV%2FcZ%2Bt9PkfbVzRMRuZR4By1hrcVbwbGOWdYHhvvork9xPyV0yq7EG4crA%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20231222T194314Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAQ2AQH7U3EIWHM4OZ%2F20231222%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Signature=77340c3639af15d8730a1c681771c46a5d5bca408659e271019a923d84930adf")
    description = db.Column(db.String)

    # relationship attributes
    user = db.relationship("User", back_populates="servers_owner")
    channels = db.relationship("Channel", back_populates="server")

    users = db.relationship(
        "User",
        secondary=user_servers,
        back_populates="servers"
    )

    def to_dict(self, channels=False):
        dictionary = {
            'id': self.id,
            'owner_id':self.owner_id,
            'name':self.name,
            'image_url':self.image_url,
            'description':self.description
        }
        print("8888888", dictionary)

        # if to_dict is called with Channels=True, load all channels
        if channels:
            # Add all channels to dictionary as a list of dictionaries
            dictionary['channels'] = [channel.to_dict(messages = True) for channel in self.channels]
            dictionary['users'] = [user.to_dict() for user in self.users]

        return dictionary
