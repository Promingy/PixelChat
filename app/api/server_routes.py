from flask import Blueprint, session, request
from ..models import db, Server, Channel, User
from flask_login import login_required
from ..forms import ServerForm, ChannelForm, UserServerForm, ImageForm
from ..aws import (upload_file_to_s3, get_unique_filename, remove_file_from_s3)

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
     - all of channels for the server,
     - the first 15 messages for each of the channels
     - all of the reactions for each message
    """

    # Grab the correct server
    server = Server.query.get(serverId)

    if server:
        return server.to_dict(channels=True)

    return  {"message": "Server Not Found"}, 404


@server.route("images", methods=["POST"])
def upload_image():
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        # print(upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when we tried to upload
        # so we send back that error message (and we printed it above)
            return {"errors":[upload]}, 401

        url = upload["url"]
        return {"url": url}

    if form.errors:
        # print(form.errors)
        return {"errors": form.errors}, 401

@server.route("images/:image_url", methods=["DELETE"])
def delete_image(image_url):
    removed = remove_file_from_s3(image_url)
    # print(removed)
    return {"removed": removed}


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
        server.name = data['name']
        server.description = data['description']
        server.image_url = data['image_url']
        db.session.commit()
        return server.to_dict(channels=True)
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

@server.route('/<int:serverId>/users/add', methods=["POST"])
@login_required
def add_user_to_server(serverId):
    form = UserServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        data = form.data
        user = User.query.get(data["id"])
        server = Server.query.get(serverId)
        user.servers.append(server)
        db.session.commit()
        return server.to_dict()
    return {'errors': form.errors}, 401

@server.route('/<int:serverId>/users/<int:userId>', methods=["DELETE"])
@login_required
def remove_user_from_server(serverId, userId):
    user = User.query.get(userId)
    server = Server.query.get(serverId)
    if user and server:
        filtered_servers = [serv for serv in user.servers if serv.id != server.id]
        user.servers = filtered_servers
        db.session.commit()
        return server.to_dict()
    elif not user:
        return {"errors": {"user": "User could not be found"}}, 404
    return {"errors": {"server": "Server could not be found"}}, 404
