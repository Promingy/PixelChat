from flask import Blueprint, request
from ..models import db, Channel
from flask_login import login_required


channel = Blueprint('channel', __name__)

@channel.route('/<int:channelId>')
@login_required
def inf_scroll_get_messages(channelId):
    """
    Route to grab next 15 messages in a designated channel
    """

    # Get correct channel
    channel = Channel.query.get(channelId)

    # if channel exists, extract offset and return messages
    if channel:

        # attempt to pull offset amount from the url, if it doesn't exist, use default
        try:
            offset = int(request.query_string.decode('utf-8').split('=')[1])
        except:
            offset = 15

        return channel.to_dict(messages=True, offset=offset)

    return {"message": "Channel Not Found"}, 404

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
