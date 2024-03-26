from flask import Blueprint, session, request
from ..models import db, DirectMessage, DirectReaction, DirectRoom, Server
from flask_login import login_required
from app.forms import ReactionForm, MessageForm

direct_message = Blueprint('direct_message', __name__)

@direct_message.route('/<int:messageId>/reactions', methods=["POST"])
@login_required
def create_reactions(messageId):
    form = ReactionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    direct_message = DirectMessage.query.get(messageId)
    reactions = DirectReaction.query.filter(DirectReaction.user_id == int(session['_user_id']),
                                      DirectReaction.message_id == messageId ).all()

    reactions = {reaction.emoji: reaction for reaction in reactions}
    reactionExists = None

    try:
        reactionExists = reactions[form.data['emoji']]
    except:
        ""

    if direct_message and form.validate_on_submit() and not reactionExists:
        data = form.data
        reaction = DirectReaction(
            user_id = int(session['_user_id']),
            message_id = messageId,
            emoji = data["emoji"]
        )
        db.session.add(reaction)
        db.session.commit()
        return reaction.to_dict()
    if not direct_message:
        return {'errors': {'message': 'Message does not exist'}}, 404
    return {'errors': form.errors}, 401

@direct_message.route('/<int:messageId>', methods=['PUT'])
@login_required
def pin_message(messageId):
    direct_message = DirectMessage.query.get(messageId)
    direct_room = DirectRoom.query.get(direct_message.direct_room_id)
    server = Server.query.get(direct_room.server_id)

    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit() and (int(direct_room.owner_1_id) == int(session['_user_id']) or int(direct_room.owner_2_id) == int(session['_user_id'])):
        data = form.data

        direct_message.pinned = data['pinned']
        db.session.commit()

        return direct_message.to_dict()

    if form.errors:
        return {"errors": form.errors}, 401

    return {"errors": {"message": "Unauthorized"}}, 403


@direct_message.route('/<int:messageId>', methods=['DELETE'])
@login_required
def delete_message(messageId):
    direct_message = DirectMessage.query.get(messageId)
    if direct_message and int(session['_user_id']) == direct_message.to_dict()['user_id']:
        db.session.delete(direct_message)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403
