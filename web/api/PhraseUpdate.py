from time import sleep
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import jwt_required, get_jwt_identity


from datetime import datetime

from db import Database

# TODO handle disconnect -> remove user from connections list and close the room


class PhraseSocket:
    def __init__(self, app):
        self.socketio = SocketIO(app)
        self.connections = list()
        self.socketio.on_event("join", self.on_join)
        self.db = Database()
        self.db.connect()

    def ping(self, username, phrases, stage):
        if username in self.connections:
            print("gang {}".format(phrases))
            phraseResults = list()
            for item in phrases:
                item["prettyTime"] = datetime.fromtimestamp(item["timestamp"]).strftime(
                        "%a, %b %-d %-I:%-M %p"
                    )
                phraseResults.append(item)
            self.socketio.emit(
                "my_response", {"phrases": phraseResults, "stage": stage}, room=username
            )

    @jwt_required
    def on_join(self, data):
        username = get_jwt_identity()
        userId = str(self.db.nameToId(username))
        self.connections.append(username)
        print("user {} has joined".format(userId))
        join_room(username)
        self.send_ini(userId, username)

    def send_ini(self, userId, username):
        phrases = self.db.getPhrases(username)
        stage = self.db.getL1Stage(userId)
        phraseResults = list()
        if phrases is None:
            return None
        for item in phrases:
            item["prettyTime"] = datetime.fromtimestamp(item["timestamp"]).strftime("%a, %b %-d %-I:%-M %p")
            phraseResults.append(item)
        self.socketio.emit(
            "my_response", {"phrases": phraseResults, "stage": stage}, room=username
        )
