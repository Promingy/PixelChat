from flask_socketio import SocketIO, emit, join_room, leave_room
import os

BASE_URL = os.getenv('BASE_URL')

if os.environ.get("FLASK_ENV") == "production":
    origins = BASE_URL
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)

@socketio.on("server")
def handle_socket(data):
    room = data["room"]
    # print("~~~~~", data)
    emit("server", data, room=room)

@socketio.on("join")
def handle_join(data):
    # print("------", data)
    room = data["room"]
    join_room(room)
    emit("server", data['user'], room=room)

@socketio.on("leave")
def handle_leave(data):
    # print("*******", data)
    room = data["room"]
    leave_room(room)
