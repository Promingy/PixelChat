from flask import Blueprint, session
from ..models import db, Reaction
from flask_login import login_required

reaction = Blueprint('reaction', __name__)

@reaction.route('<int:reactionId>', methods=["DELETE"])
@login_required
def delete_reaction(reactionId):
    reaction = Reaction.query.get(reactionId)
    if reaction and int(session['_user_id']) == reaction.to_dict()['user_id']:
        db.session.delete(reaction)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403
