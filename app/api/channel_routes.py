from flask import Blueprint
from ..models import db
from flask_login import login_required


channel = Blueprint('channel', __name__)

@channel.route('/<int:channelId>/messages', methods=["POST"])
@login_required
def create_message():
    pass

@channel.route('/<int:channelId>', methods=['DELETE'])
@login_required
def delete_channel(channelId):
    pass

@channel.route('/<int:channelId>', methods=['PUT'])
@login_required
def edit_channel(channelId):
    pass

