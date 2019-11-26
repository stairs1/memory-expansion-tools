import socket
import time
import json
import threading


class WIFIReceiver():

    def __init__(self):
        self.UDP_IP=''
        self.UDP_port = 5005
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.UDP_IP, self.UDP_port))
        self.on = False
        self.phrases = ['','','','','']

    def start(self):
        self.on = True
        while self.on:
            data, addr = self.sock.recvfrom(1024)
            print('\nreceived following message\n--------------')
            print(json.loads(data.decode()))
            for i, phraseobj in enumerate(json.loads(data.decode())):
                self.phrases[i] = str(i+1) + '. ' +  phraseobj['speech']
            time.sleep(0.01)

receiver = WIFIReceiver()
t1 = threading.Thread(target=receiver.start).start()
#app = Flask(__name__)
#app.config['SECRET_KEY'] = 'fartyvnkdjnfjknfl1232#'
#socketio = SocketIO(app)
#
#socketio.emit('phrase_update', {"p1":"fun"})
#
#@app.route('/')
#def sessions():
#    return render_template('dynamic.html')
#
##@app.route("/output")
##def output():
##    return render_template(
##            'dynamic.html',
##            title='DYNAMIC Conversation:',
##            phrase1=receiver.phrases[0],
##            phrase2=receiver.phrases[1],
##            phrase3=receiver.phrases[2],
##            phrase4=receiver.phrases[3],
##            phrase5=receiver.phrases[4]
##        )
##
#if __name__ == "__main__":
#    socketio.run(app, debug=True, port=5210)
#
