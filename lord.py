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
        self.command_manager = voice_commands.SpokenCommandManager()
        print('receiver listening on port', self.UDP_port)

    def run(self):
        while True:
            data, addr = self.sock.recvfrom(1024)
            self.handle(data)
            # disabled for testing
#            server.send(self.phrases, self.stage)
            print('sending: ', self.phrases, self.stage)

    def handle_data(self, data):
        speech = json.loads(data.decode())['speech']
        print('updating buffers with', speech)))
        cmd_index = self.command_manager.parse_command(speech)
        if cmd_index is not None:
            self.stage.insert(0, self.phrases.pop(cmd_index))
            if len(self.stage) > self.stage_len:
                self.stage = self.stage[:self.stage_len]
        else:
            self.phrases.insert(0, speech)
            if len(self.phrases) > self.phrases_len):
                self.phrases = self.phrases[:self.stage_len]


receiver = WIFIReceiver()
t1 = threading.Thread(target=receiver.run).start()

server.start()

