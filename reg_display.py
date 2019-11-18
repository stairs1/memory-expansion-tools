import socket
import time


class WIFIReceiver():

    def __init__(self):
        self.UDP_IP=''
        self.UDP_port = 5005
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.UDP_IP, self.UDP_port))
        self.on = False

    def start(self):
        self.on = True
        while self.on:
            data, addr = self.sock.recvfrom(1024)
            print('\nreceived following message\n--------------')
            print(data)
            time.sleep(0.01)

receiver = WIFIReceiver()
receiver.start()
