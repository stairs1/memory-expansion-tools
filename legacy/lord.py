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
        self.phrases = []
        self.stage = []
        self.phrases_len = 10
        self.stage_len = 8
        self.ptime = None
        self.command_manager = voice_commands.SpokenCommandManager()
        print('receiver listening on port', self.UDP_port)

    def run(self):
        while True:
            data, addr = self.sock.recvfrom(50024)
            self.handle_data(data)

    def handlePhrasing(self, data):
        speech = data['phrases'][0]['speech']
        print('updating buffers with', speech)

        cmd_index, remove = self.command_manager.parse_command(speech)
        if cmd_index is not None and remove is not None:
            if remove is True and cmd_index < len(self.stage):
                self.stage.pop(cmd_index)
            elif remove is False and cmd_index < len(self.phrases):
                self.stage.insert(0, self.phrases.pop(cmd_index))
                if len(self.stage) > self.stage_len:
                    self.stage = self.stage[:self.stage_len]
        else:
            self.phrases.insert(0, speech)
            if len(self.phrases) > self.phrases_len:
                self.phrases = self.phrases[:self.stage_len]
        server.send(self.phrases, self.stage)

        
    def handleMemory(self, data):
        server.remember(data)
        
    def handle_data(self, data):
        data_decoded = json.loads(data.decode())

        # do not accept repeats
        if data_decoded['phrases'][0]['timestamp'] == self.ptime:
            print("DEBUG: repeat request")
            return

        # do not accept empty strings or whitespace
        if data_decoded['phrases'][0]['speech'] == '' or data_decoded['phrases'][0]['speech'].isspace():
            print("DEBUG: malformed speech string")
            return
        
        self.ptime = data_decoded['phrases'][0]['timestamp']
    
        if data_decoded['type'] == "phrasing":
            self.handlePhrasing(data_decoded)
        else: #if data_decoded['type'] == "talk":
            self.handleMemory(data_decoded)



receiver = WIFIReceiver()
t1 = threading.Thread(target=receiver.run).start()

server.start()

