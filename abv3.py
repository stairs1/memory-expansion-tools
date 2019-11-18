import subprocess
import socket


def noop(*args, **kwargs):
    pass


class Register():
    
    def __init__(self, display_callback=noop):
        self.on = False
        self.registry = []
        self.display_callback = display_callback

    def start(self):
        self.on = True
        self.record_loop()

    def record_loop(self):
        while self.on:
            speech = subprocess.run(['termux-speech-to-text'], capture_output=True)
            if speech.stdout != b'':
                self.registry.append(speech.stdout)
            print()
            print("current registry: ")
            for i, reg in enumerate(self.registry):
                print(i, ".", reg)
                self.display_callback(reg)

            
class WIFITransmitter():

    def __init__(self):
        self.UDP_IP = '192.168.0.22'
        self.UDP_port = 5005
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def send(self, message):
        self.sock.sendto(message, (self.UDP_IP, self.UDP_port))


wifi = WIFITransmitter()
reg = Register(display_callback=wifi.send)
reg.start()
