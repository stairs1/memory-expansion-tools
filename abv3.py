import subprocess
import socket
import time
import json


def noop(*args, **kwargs):
    pass


class Register():
    
    def __init__(self, display_callback=noop):
        self.on = False
        self.registry = []
        self.display_callback = display_callback
        self.registry_len = 5

    def start(self):
        self.on = True
        self.record_loop()

    def get_speech(self):
        """
        Gets transcription, stores it with timestamps in registry.
        Ensures registry does not exceed max length
        """
        tstart = time.time()
        speech = subprocess.run(['termux-speech-to-text'], capture_output=True)
        tfin = time.time()
        if speech.stdout != b'':
            self.registry.insert(
                0, {'speech': speech.stdout.decode("utf-8").rstrip(), 'start': tstart, 'end': tfin}
            )
        if len(self.registry) > self.registry_len:
            self.registry = self.registry[:self.registry_len]

    def record_loop(self):
        while self.on:
            self.get_speech()
            print()
            print("current registry: ")
            for i, reg in enumerate(self.registry):
                print(i, ".", reg)
            self.display_callback(self.registry)

            
class WIFITransmitter():

    def __init__(self):
        self.UDP_IP = '192.168.0.22'
        self.UDP_port = 5005
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def send(self, message):
        assert isinstance(message,list)
        self.sock.sendto(json.dumps(message).encode(), (self.UDP_IP, self.UDP_port))


wifi = WIFITransmitter()
reg = Register(display_callback=wifi.send)
reg.start()
