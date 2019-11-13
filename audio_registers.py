import subprocess
import time
import contextlib
import wave
import numpy as np
import matplotlib.pyplot as plt
import webrtcvad

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
                prevt = time.time()
                self.callback()


class AudioGrabber():

    def __init__(self, interval, circ_buf_size):
        self.interval = interval
        self.index = 1
        self.circ_buf_size = circ_buf_size

    def receive_tick(self):
        print('tick received...')
        filename = 'audio_buffer/' + str(self.index) + '.wav'
        m4a_fn = filename[:-4] + '.m4a'
        subprocess.run(['rm', filename, m4a_fn], capture_output=True)
        self.record(filename, m4a_fn)
        self.index = (self.index + 1) % self.circ_buf_size

#        self.process_audio(*self.read_wave(filename))
        print('tick handled')

    def record(self, filename, m4a_fn):
        # linux
#        subprocess.run(['rec', filename, 'trim', '0', str(self.interval)], capture_output=True)

        # android
        subprocess.run(['termux-microphone-record', '-f', m4a_fn, '-l', str(self.interval)])
        subprocess.run(['ffmpeg', '-i', m4a_fn, filename])
        
    
    def process_audio(self, audio, sample_rate):
        frames = frame_generator(30, audio, sample_rate)
        frames = list(frames)
        #here for visualization, this a tool
        visarray = np.zeros(len(frames))
        for i, frame in enumerate(frames):
            is_speech = vad.is_speech(frame.bytes, sample_rate)
            visarray[i] = is_speech
        plt.plot(visarray)
        plt.show()

    def read_wave(self, path):
        """Reads a .wav file.
        Takes the path, and returns (PCM audio data, sample rate).
        """
        with contextlib.closing(wave.open(path, 'rb')) as wf:
            num_channels = wf.getnchannels()
            assert num_channels == 1
            sample_width = wf.getsampwidth()
            assert sample_width == 2
            sample_rate = wf.getframerate()
            assert sample_rate in (8000, 16000, 32000, 48000)
            pcm_data = wf.readframes(wf.getnframes())
            return pcm_data, sample_rate


class Frame(object):
    """Represents a "frame" of audio data."""
    def __init__(self, bytes, timestamp, duration):
        self.bytes = bytes
        self.timestamp = timestamp
        self.duration = duration


def frame_generator(frame_duration_ms, audio, sample_rate):
    """Generates audio frames from PCM audio data.
    Takes the desired frame duration in milliseconds, the PCM data, and
    the sample rate.
    Yields Frames of the requested duration.
    """
    n = int(sample_rate * (frame_duration_ms / 1000.0) * 2)
    offset = 0
    timestamp = 0.0
    duration = (float(n) / sample_rate) / 2.0
    while offset + n < len(audio):
        yield Frame(audio[offset:offset + n], timestamp, duration)
        timestamp += duration
        offset += n

aggressiveness = 1
vad = webrtcvad.Vad(aggressiveness)
file_interval_s = 1
aud = AudioGrabber(file_interval_s, 50)
clock = Ticker(file_interval_s, aud.receive_tick)
#aud.process_audio(*aud.read_wave('sandra.wav'))
