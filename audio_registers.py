import subprocess
import time
import contextlib
import wave
import os
import threading


class Ticker():

    def __init__(self, handler, filename):
        self.interval=2
        self.check=0.010
        self.handler = handler
        self.filename=filename
        self.buf_directory = 'audio_buffer'

    def file_tick(self):
        while True:
            if self.filename not in os.listdir(self.buf_directory):
                time.sleep(self.check)
            else:
                time.sleep(self.interval)
                handler()


class AudioBuffer():
    """
    Maintains a fixed-size buffer of audio data. 
    Configurable to send notifications on buffer updates.
    """

    def __init__(self, notify=self.noop):
        # file buffer access
        self.android = False
        self.filename = 'buf.wav'
        self.filepath = 'audio_buffer/buf.wav'
        self.m4a_file = 'buf.m4a' if self.android else None
        self.m4a_filepath = 'audio_buffer/buf.m4a' if self.android else None

        # python buffer properties
        # 2 bytes per sample, 16000 samples per second =~2MB 60s buffer
        self.audio_buffer_len_s = 60
        self.sample_f = 16000
        self.sample_width = 2
        self.max_buf_size = self.audio_buffer_len_s * self.sample_f * self.sample_width 
        self.audio = bytes()

        self.ticker = Ticker(
                self.handler, self.m4a_file if self.android else self.filename
        )
        self.notification_callback = notify

    def handler(self):
        # android records m4a audio, convert to wav to process
        if(self.android):
            subprocess.run(['ffmpeg', '-i', self.m4a_filepath, self.filepath])
            subprocess.run(['rm', self.m4a_filepath])

        audio = self.decode_audio()
        self.add_audio_to_front(audio)
        subprocess.run(['rm', self.filepath])
        self.record()
        send_notification()

    def start(self):
        self.record()
        self.ticker.file_tick()

    def record(self):
        """
        Asynchronously record audio from mic into file.
        """
        if(self.android):
            thread = threading.Thread(
                    target=subprocess.run,
                    args=[
                        'termux-microphone-record',
                        '-f', self.m4a_filename,
                        '-l', str(self.interval)
                    ],
                    kwargs={'capture_output':True}
            )
            thread.start()
        else:
            thread = threading.Thread(target=subprocess.run,
                args=['rec', self.filepath, 'trim', '0', str(self.interval)],
                kwargs={'capture_output':True}
            )
            thread.start()

    def noop(self):
        pass

    def send_notification(self):
        """
        Call notification function asynchronously. 
        Can use to process new data when buffer is updated.
        """
        thread = threading.Thread(target=self.notification_callback, args = None, kwargs=None)
        thread.start()

    def decode_audio(self):
        """
        Reads .wav file into bytes
        """
        with contextlib.closing(wave.open(self.filepath, 'rb')) as wf:
            num_channels = wf.getnchannels()
            assert num_channels == 1
            sample_width = wf.getsampwidth()
            assert sample_width == 2
            sample_rate = wf.getframerate()
            assert sample_rate == 16000
            pcm_data = wf.readframes(wf.getnframes())
            return pcm_data

    def add_audio_to_front(self, audio):
        """
        Add audio to front of audio buffer.
        If audio buffer is full, remove end bytes.
        """
        self.audio = audio + self.audio
        if(len(self.audio) > self.max_buf_size):
            self.audio = self.audio[:self.max_buf_size]

    def get_aud(self, start, end):
        """
        Return bytes of audio from start time to end time (seconds).
        Raises AssertionError on out of bounds access.
        Raises outofboundserror when data not present.
        
        self.audio_buffer_len_s = 60
        self.sample_f = 16000
        self.max_buf_size = self.audio_buffer_len_s * self.sample_f * 2 
        self.audio = bytes()
        """
        assert start > end
        assert start >= 0
        assert end <= self.audio_buffer_len_s

        startbytes = int(start * self.sample_f * self.sample_width)
        endbytes = int(end * self.sample_f * self.sample_width)
        data = self.audio[startbytes:endbytes]

        return data

