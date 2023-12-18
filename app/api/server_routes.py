from flask import Blueprint, session, request
from ..models import db, Server, Channel
from flask_login import login_required
from ..forms import ServerForm, ChannelForm

server = Blueprint('server', __name__)

@server.route('', methods=['GET'])
@login_required
def get_everything():
    servers = Server.query.all()
    return { server.to_dict()['id']: server.to_dict() for server in servers }

@server.route('/<int:serverId>')
@login_required
def get_all_server_info(serverId):
    """
    Route that grabs all Server data,
    all of channels for the server,
    the first 15 messages for each of the channels
    all of the reactions for each message
    """

    # Grab the correct server
    server = Server.query.get(serverId)

    return server.to_dict(channels=True)

@server.route('', methods=['POST'])
@login_required
def create_server():
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_server = Server(
            owner_id = int(session['_user_id']),
            name = data["name"],
            image_url = data["image_url"],
            description = data["description"]
        )
        db.session.add(new_server)
        db.session.commit()
        return new_server.to_dict()
    return {'errors': form.errors}, 401

@server.route('/<int:serverId>', methods=['PUT'])
@login_required
def edit_server(serverId):
    form = ServerForm()
    server = Server.query.get(serverId)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit() and int(session['_user_id']) == server.to_dict()['owner_id']:
        data = form.data
        server['name'] = data['name']
        server['description'] = data['description']
        server['image_url'] = data['image_url']
        db.session.commit()
        return server.to_dict()
    elif not form.validate_on_submit():
        return {'errors': form.errors}, 401
    return {'errors': {'message': 'Unauthorized'}}, 403

@server.route('/<int:serverId>', methods=['DELETE'])
@login_required
def delete_server(serverId):
    server = Server.query.get(serverId)
    if server and int(session['_user_id']) == server.to_dict()['owner_id']:
        db.session.delete(server)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    return {'errors': {'message': 'Unauthorized'}}, 403

@server.route('/<int:serverId>/channels', methods=["POST"])
@login_required
def create_channel(serverId):
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        new_channel = Channel(
            owner_id = int(session['_user_id']),
            server_id = int(serverId),
            name = data["name"],
            topic = data["topic"],
            description = data["description"]
        )
        db.session.add(new_channel)
        db.session.commit()
        return new_channel.to_dict()
    return {'errors': form.errors}, 401
