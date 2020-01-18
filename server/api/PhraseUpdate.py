from time import sleep
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import jwt_required, get_jwt_identity

from db import Database

#TODO handle disconnect -> remove user from connections list and close the room

class PhraseSocket:
    def __init__(self, app):
        self.socketio = SocketIO(app)
        self.connections = list()
        self.socketio.on_event('join', self.on_join)
        self.db = Database()
        self.db.connect()

    def ping(self, userId, phrases, stage):
        print("pinged")
        if userId in self.connections:
            print("sending out...")
            print(phrases, stage)
            self.socketio.emit('my_response', {'phrases': phrases, 'stage': stage}, room=userId)

    @jwt_required
    def on_join(self, data):
        username = get_jwt_identity()
        userId = str(self.db.nameToId(username))
        
        self.connections.append(userId)
        print("user {} has joined".format(userId))
        join_room(userId)
        self.send_ini(userId)

    def send_ini(self, userId):
        phrases = self.db.getPhrases(userId)
        stage = self.db.getL1Stage(userId)
        print(phrases, stage)
        self.socketio.emit('my_response', {'phrases': phrases, 'stage': stage}, room=userId)
