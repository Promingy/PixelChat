from flask import Blueprint, session
from ..models import db, Message
from flask_login import login_required

message = Blueprint('message', __name__)

@message.route('/<int:messageId>/reactions', methods=["POST"])
@login_required
def create_channel(messageId):
    pass

@message.route('/<int:messageId>', methods=['DELETE'])
@login_required
def delete_message(messageId):
    message = Message.query.get(messageId)
    if message and int(session['_user_id']) == message.to_dict()['user_id']:
        db.session.delete(message)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403
