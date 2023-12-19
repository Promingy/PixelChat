from flask_socketio import SocketIO, emit
import os

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://slack-deploy.onrender.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on("chat")
def handle_socket(data):
    print("~~~~~", data)
    emit("chat", data, broadcast=True)

# data = {
#     channelId: 1,
#     body: "ASFDADFDAG",
#     userId: 7,
#     pinned: False
# }