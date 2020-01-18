from time import sleep
from flask_socketio import SocketIO, emit, join_room, leave_room

class PhraseSocket:
    def __init__(self, app):
        self.socketio = SocketIO(app)
        self.connections = list()
        self.socketio.on_event('connect', self.on_connect)
        self.socketio.on_event('join', self.on_join)

    def ping(self, userId, phrases, stage):
        print("pinged")
        if userId in self.connections:
            print("sending out...")
            print(phrases, stage)
            self.socketio.emit('my_response', {'phrases': phrases, 'stage': stage}, room=userId)

    def on_join(self, data):
        userId = data['userId']
        self.connections.append(userId)
        print("user {} has joined".format(userId))
        join_room(userId)
    
    def on_connect(self):
        print("new connection")

    

