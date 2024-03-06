from flask import Blueprint, request, session
from ..models import db, DirectRoom, DirectMessage
from flask_login import login_required
from ..forms import MessageForm


direct_room = Blueprint('direct_room', __name__)

@direct_room.route('/<int:roomId>')
@login_required
def inf_scroll_get_messages(roomId):
    """
    Route to grab next 15 messages in a designated channel
    """

    # Get correct channel
    direct_room = DirectRoom.query.get(roomId)

    # if channel exists, extract offset and return messages
    if direct_room:

        # attempt to pull offset amount from the url, if it doesn't exist, use default
        try:
            offset = int(request.query_string.decode('utf-8').split('=')[1])
        except:
            offset = 15

        return direct_room.to_dict(messages=True, offset=offset)

    return {"message": "Channel Not Found"}, 404

# POST - Create a new message for a channel
@direct_room.route('/<int:roomId>/messages', methods=["POST"])
@login_required
def create_message(roomId):
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    # add server and direct room validation for user
    if form.validate_on_submit():
        data = form.data
        new_message = DirectMessage(
            user_id = int(session['_user_id']),
            direct_room_id = roomId,
            body = data["body"],
            pinned = data["pinned"]
        )
        db.session.add(new_message)
        db.session.commit()
        return new_message.to_dict()
    return {'errors': form.errors}, 401

