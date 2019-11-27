import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from time import sleep

app = Flask(__name__)
app.debug=True
app._static_folder = os.path.abspath("templates/static/")
socketio = SocketIO(app)

thread=None
def noop(*args, **kwargs): pass
thread_fp = noop
ss1,ss2,ss3,ss4,ss5 = '','','','heyyy im 4',''

def sendit():
    global thread_fp
    socketio.emit('my_response', {'bar': 'Phrases', 'p1': ss1, 'p2': ss2, 'p3': ss3, 'p4': ss4, 'p5': ss5})
    thread_fp = noop

def send(ts1, ts2, ts3, ts4, ts5):
    global ss1, ss2, ss3, ss4, ss5, thread_fp
    ss1 = ts1
    ss2 = ts2
    ss3 = ts3
    ss4 = ts4
    ss5 = ts5
    thread_fp = sendit

def background_thread():
    bobnum = 0
    while True:
        sleep(0.1)
        thread_fp()

@socketio.on('connect')
def connect_fn():
    global thread
    emit('my_response', {'bar': 'Connected', 'p1': 'nothing so far tbh'})
    if thread is None:
        thread = socketio.start_background_task(background_thread)
        
@app.route('/')
def basic():
    return render_template('convo.html')

def start():
    app.run()

