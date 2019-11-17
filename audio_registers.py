import audio_buffer
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from  matplotlib.animation import FuncAnimation
import webrtcvad
import time
import threading


class Frame(object):
    """Represents a "frame" of audio data."""
    def __init__(self, bytes, duration):
        self.bytes = bytes
        self.duration = duration

    @staticmethod
    def frame_generator(frame_duration, audio, sample_rate=16000):
        """Generates audio frames from PCM audio data.
        Takes the desired frame duration in seconds, the PCM data, and
        the sample rate.
        Yields Frames of the requested duration.
        """
        n = int(sample_rate * frame_duration * 2)  # 2*num samples in frame
        offset = 0  # in bytes
        while offset + n < len(audio):
            yield Frame(audio[offset:offset + n], frame_duration)
            offset += n


class LineAnimation():

    fig = plt.figure()
    ax = plt.axes(xlim=(0, 60), ylim=(-2, 2))
    line, = ax.plot([], [], lw=4)
    x = np.linspace(0,2,51)
    y = np.zeros(51)
    plt.style.use('seaborn-pastel')
    aggressiveness = 1
    vad = webrtcvad.Vad(aggressiveness)

    @classmethod
    def init(cls):
        cls.line.set_data([], [])
        return cls.line,

    @classmethod
    def animate(cls, i):
        x = cls.x
        y = cls.y
        cls.line.set_data(x, y)
        return cls.line,

    @classmethod
    def callback(cls):
        global buf
        frames = Frame.frame_generator(0.030, buf.audio, buf.sample_f)
        frames = list(frames)
        x = np.linspace(0,0.03*len(frames),len(frames))
        y = np.zeros(len(frames))
        for i, frame in enumerate(frames):
            is_speech = cls.vad.is_speech(frame.bytes, buf.sample_f)
            y[i] = is_speech
        cls.x = x
        cls.y = y
        print('set class vars x and y')


buf = audio_buffer.AudioBuffer(notify=LineAnimation.callback)
t1 = threading.Thread(target=buf.start)
t1.start()



anim = FuncAnimation(
    LineAnimation.fig, LineAnimation.animate,
    init_func=LineAnimation.init, frames=200, interval=20, blit=True
)
plt.show()



class VoicePlot():

    def __init__(self):
        self.visarray = []
        self.xs = []
        self.fig = plt.figure()
        self.ax = plt.axes(xlim=(0,1000), ylim=(-2,2))
        self.sam = self.ax.plot([], [], lw=3)
        self.start_animation(self.xs, self.visarray)

    def callback(self):
        print('received notify')
        frames = Frame.frame_generator(0.030, buf.audio, buf.sample_f)
        frames = list(frames)
        tarray = np.zeros(len(frames))
        for i, frame in enumerate(frames):
            self.xs.append(len(self.xs))
            is_speech = vad.is_speech(frame.bytes, buf.sample_f)
            tarray[i] = is_speech
        self.visarray = self.visarray + list(tarray)

        print(len(self.visarray))

    def animate(self, trash,x,y):
#        axes.clear()
        self.sam.set_data(x, y)


    def start_animation(self, x, y):
#        self.axes.set_ylim([-0.5, 1.5])
#        self.axes.set_ylabel('voice activity')
#        self.axes.set_xlabel('time(s)')

        anal = animation.FuncAnimation(self.fig, self.animate, fargs=(x,y), interval=10)
        plt.show()

