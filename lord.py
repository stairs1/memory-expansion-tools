import server
import threading
import time
import socket
import json
import voice_commands

class WIFIReceiver():

    def __init__(self):
        self.UDP_IP=''
        self.UDP_port = 5005
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.UDP_IP, self.UDP_port))
        self.on = False
        self.phrases = ['','','','','']
        self.stage = ''
        self.stage_vacant = True
        self.command_manager = voice_commands.SpokenCommandManager()
#        self.command_manager.commands['davinci'] = self.set_stage
        print('receiver listening on port', self.UDP_port)

    def start(self):
        self.on = True
        while self.on:
            data, addr = self.sock.recvfrom(1024)
            print('\nreceived following message\n--------------')
            content = json.loads(data.decode())
            print(content)
            index = self.command_manager.parse_command(content[0]['speech'])
            if self.stage_vacant:
                if index is not None:
                    self.stage = self.phrases[index]
                    self.stage_vacant = False
            for i, phraseobj in enumerate(json.loads(data.decode())):
                self.phrases[i] = phraseobj['speech']
            server.send(self.phrases[0], self.phrases[1], self.phrases[2], self.phrases[3], self.phrases[4], self.stage)
            time.sleep(0.01)

#    def set_stage(self, message):
##        self.stage = message
#
#        self.stage = self.phrases[

receiver = WIFIReceiver()
t1 = threading.Thread(target=receiver.start).start()

server.start()

