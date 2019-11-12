import subprocess
import time

class Ticker():

    def __init__(self, interval, callback, check=0.100):
        self.interval = interval
        self.callback = callback
        self.check=check
        self.tick_away()

    def tick_away(self):
        prevt = time.time()
        while True:
            if(time.time() - prevt < self.interval):
                time.sleep(self.check)
            else:
                self.callback()
                prevt = time.time()


class AudioGrabber():

    def __init__(self, interval, circ_buf_size):
        self.interval = interval
        self.index = 1
        self.circ_buf_size = circ_buf_size

    def receive_tick(self):
        print('tick received...')
        filename = 'audio_buffer/' + str(self.index) + '.wav'
        subprocess.run(['rm', filename])
        self.record(filename)
        self.index = (self.index + 1) % self.circ_buf_size

    def record(self, filename):
        # linux
#        subprocess.run(['rec', filename, 'trim', '0', str(self.interval)])

        # android
        subprocess.run(['termux-microphone-record', '-f', filename, '-l', str(self.interval)])
     
file_interval_s = 1
aud = AudioGrabber(file_interval_s, 50)
clock = Ticker(file_interval_s, aud.receive_tick)
