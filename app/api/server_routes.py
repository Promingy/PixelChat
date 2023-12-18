from flask import Blueprint, session
from ..models import db, Server
from flask_login import login_required


server = Blueprint('server', __name__)

@server.route('', methods=['GET'])
@login_required
def get_everything():
    servers = Server.query.all()
    return { server.to_dict()['id']: server.to_dict() for server in servers }

@server.route('/<int:serverId>')
@login_required
def get_all_server_info(serverId):
    server = Server.query.get(serverId)
    return server.to_dict(channels=True)

@server.route('', methods=['POST'])
@login_required
def create_server():
    pass

@server.route('/<int:serverId>', methods=['PUT'])
@login_required
def edit_server(serverId):
    pass

@server.route('/<int:serverId>', methods=['DELETE'])
@login_required
def delete_server(serverId):
    server = Server.query.get(serverId)
    if server and int(session['_user_id']) == server.to_dict()['owner_id']:
        db.session.delete(server)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 401

@server.route('/<int:serverId>/channels', methods=["POST"])
@login_required
def create_channel(serverId):
    pass
