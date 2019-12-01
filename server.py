import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from time import sleep

app = Flask(__name__)
app.debug=False
app._static_folder = os.path.abspath("templates/static/")
socketio = SocketIO(app)
server_thread = None

phrases = []
stage = []
data_ready = False

def send(_phrases, _stage):
    global phrases, stage, data_ready
    phrases = _phrases
    stage = _stage
    data_ready = True

def server_poll():
    global data_ready
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
    app.run(host='0.0.0.0')

