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

#custom stuff
from db import Database
from forms import SearchForm
from api.SearchEndpoint import SearchPage
import json
from bson.json_util import dumps
from datetime import datetime

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


@app.route('/search', methods=['GET', 'POST'])
def search():

#    if request.method == "POST":
#        data = request.json
#        if(data):
#            print(data)
#            r = db.search(data['userId'], data['query'])
#            for item in r:
#                print(item)
#            return dumps(r)


    temp_uid = "5e0f73467c1ffbca9ce828b2"
    form = SearchForm()
    if form.validate_on_submit():
        data = form.search_item.data

        print(data)
        r = db.search(temp_uid, data)
        for item in r:
            print(item)
            pretty_time = datetime.fromtimestamp(item['timestamp']).strftime("%a, %b %-d %-I:%-M %p")
            flash(f"{item['talk']}   {pretty_time}")

        results = [{
           'words': item['talk'],
           'time': datetime.fromtimestamp(item['timestamp']).strftime("%a, %b %-d %-I:%-M %p")
        } for item in r]


        return redirect('/search')
        
    return render_template('search.html', title='Search for ya', form=form)


def start():
    db.connect()
    api.add_resource(SearchPage, '/search')
    app.run()

if __name__ == "__main__":
    start()
