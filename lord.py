import server
import threading
import time
import socket
import json

class WIFIReceiver():

    def __init__(self):
        self.UDP_IP=''
        self.UDP_port = 5005
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.UDP_IP, self.UDP_port))
        self.on = False
        self.phrases = ['','','','','']
        print('receiver listening on port', self.UDP_port)

    def start(self):
        self.on = True
        while self.on:
            data, addr = self.sock.recvfrom(1024)
            print('\nreceived following message\n--------------')
            print(json.loads(data.decode()))
            for i, phraseobj in enumerate(json.loads(data.decode())):
                self.phrases[i] = str(i+1) + '. ' +  phraseobj['speech']
            server.send(self.phrases[0], self.phrases[1], self.phrases[2], self.phrases[3], self.phrases[4])
            time.sleep(0.01)

receiver = WIFIReceiver()
t1 = threading.Thread(target=receiver.start).start()

server.start()

