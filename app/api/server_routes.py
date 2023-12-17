from flask import Blueprint
from ..models import db, Server
from flask_login import login_required


server = Blueprint('server', __name__)

@server.route('', methods=['GET'])
@login_required
def get_everything():
    servers = Server.query.all()
    return { server.to_dict()['id']: server.to_dict() for server in servers }

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
    pass

@server.route('/<int:serverId>/channels', methods=["POST"])
@login_required
def create_channel(serverId):
    pass
