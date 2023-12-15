from flask import Blueprint
from ..models import db
from flask_login import login_required

reaction = Blueprint('reaction', __name__)

@reaction.route('<int:reactionId>', methods=["DELETE"])
@login_required
def delete_reaction(reactionId):
    pass