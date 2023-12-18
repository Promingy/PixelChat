from flask import Blueprint
from ..models import db
from flask_login import login_required

message = Blueprint('message', __name__)

@message.route('/<int:messageId>/reactions', methods=["POST"])
@login_required
def create_channel(messageId):
    pass

@message.route('/<int:messageId>', methods=['DELETE'])
@login_required
def delete_channel(messageId):
    pass
