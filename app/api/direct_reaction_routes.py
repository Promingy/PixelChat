from flask import Blueprint, session
from ..models import db, DirectReaction
from flask_login import login_required

direct_reaction = Blueprint('direct_reaction', __name__)

@direct_reaction.route('<int:reactionId>', methods=["DELETE"])
@login_required
def delete_reaction(reactionId):
    direct_reaction = DirectReaction.query.get(reactionId)
    if direct_reaction and int(session['_user_id']) == direct_reaction.to_dict()['user_id']:
        db.session.delete(direct_reaction)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403
