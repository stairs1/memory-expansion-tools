#flask
from flask import Flask, render_template, flash, redirect, jsonify
from flask_socketio import SocketIO, emit
from flask import request
from flask_restful import Api
from bson.json_util import dumps

#regular stuff
import json
from time import sleep
import os
from datetime import datetime

#custom stuff
from db import Database
from forms import SearchForm
from api.SearchEndpoint import SearchPage

app = Flask(__name__)
app.debug=True
app._static_folder = os.path.abspath("templates/static/")
app.config['SECRET_KEY'] = 'super special secret'

api = Api(app) #flask_restful

socketio = SocketIO(app)
server_thread = None

db = Database()

phrases = []
stage = []
data_ready = False

def send(_phrases, _stage):
    global phrases, stage, data_ready
    phrases = _phrases
    stage = _stage
    data_ready = True

def remember(data): 
    userId = data['userId']
    reqType = data['type']
    phraseList = data['phrases']

    for phrase in phraseList:
        timestamp = phrase['timestamp']
        speech = phrase['speech']
        if reqType == "talk":
            resp = db.addTalk(userId, speech, timestamp)
            print(resp)


def server_poll():
    global data_ready, db
    while True:
        sleep(0.1)
        if data_ready:
            socketio.emit('my_response', {'phrases': phrases, 'stage': stage})

            data_ready = False

@socketio.on('connect')
def on_connect():
    global server_thread
    emit('my_response', {'phrases': ['nothing so far tbh'], 'stage': ['']})
    if server_thread is None:
        server_thread = socketio.start_background_task(server_poll)
        
@app.route('/')
def main_page():
    return render_template('convo.html')

def start():
    db.connect()
    api.add_resource(SearchPage, '/search')
    api.add_resource(TimeFlow, '/timeflow')
    app.run()

if __name__ == "__main__":
    start()
