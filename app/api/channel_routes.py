from flask import Blueprint, request, session
from ..models import db, Channel, Message
from flask_login import login_required
from ..forms import ChannelForm, MessageForm


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

# POST - Create a new message for a channel
@channel.route('/<int:channelId>/messages', methods=["POST"])
@login_required
def create_message(channelId):
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_message = Message(
            user_id = int(session['_user_id']),
            channel_id = channelId,
            body = data["body"],
            pinned = data["pinned"]
        )
        db.session.add(new_message)
        db.session.commit()
        return new_message.to_dict()
    return {'errors': form.errors}, 401

# DELETE channel by ID
@channel.route('/<int:channelId>', methods=['DELETE'])
@login_required
def delete_channel(channelId):
    channel = Channel.query.get(channelId)
    if channel and int(session['_user_id']) == channel.to_dict()['owner_id']:
        db.session.delete(channel)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403

# PUT/PATCH - Update channel by ID
@channel.route('/<int:channelId>', methods=['PUT'])
@login_required
def edit_server(channelId):
    form = ChannelForm()
    channel = Channel.query.get(channelId)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit() and int(session['_user_id']) == channel.to_dict()['owner_id']:
        data = form.data
        channel.name = data['name']
        channel.description = data['description']
        channel.topic = data['topic']
        db.session.commit()
        return channel.to_dict(messages=True)
    elif not form.validate_on_submit():
        return {'errors': form.errors}, 401
    return {'errors': {'message': 'Unauthorized'}}, 403
