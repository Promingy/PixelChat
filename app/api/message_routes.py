from flask import Blueprint, session, request
from ..models import db, Message, Reaction, Channel, Server
from flask_login import login_required
from app.forms import ReactionForm, MessageForm

message = Blueprint('message', __name__)

@message.route('/<int:messageId>/reactions', methods=["POST"])
@login_required
def create_reactions(messageId):
    form = ReactionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    message = Message.query.get(messageId)
    if message and form.validate_on_submit():
        data = form.data
        reaction = Reaction(
            user_id = int(session['_user_id']),
            message_id = messageId,
            emoji = data["emoji"]
        )
        db.session.add(reaction)
        db.session.commit()
        return reaction.to_dict()
    if not message:
        return {'errors': {'message': 'Message does not exist'}}
    return {'errors': form.errors}, 401

@message.route('/<int:messageId>', methods=['PUT'])
@login_required
def pin_message(messageId):
    message = Message.query.get(messageId)
    channel = Channel.query.get(message.channel_id)
    server = Server.query.get(channel.server_id)

    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit() and int(server.owner_id) == int(session['_user_id']):
        data = form.data

        message.pinned = data['pinned']
        db.session.commit()

        return message.to_dict()

    if form.errors:
        return {"errors": form.errors}, 401

    return {"errors": {"message": "Unauthorized"}}, 403


@message.route('/<int:messageId>', methods=['DELETE'])
@login_required
def delete_message(messageId):
    message = Message.query.get(messageId)
    if message and int(session['_user_id']) == message.to_dict()['user_id']:
        db.session.delete(message)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403
