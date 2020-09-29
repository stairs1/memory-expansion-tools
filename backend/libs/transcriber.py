import time, logging
import deepspeech
import numpy as np
import threading
from scipy import signal
import pathlib
import os

class Transcriber:
    """
    Stateful layer to hold audio data and interface with deepspeech.
    holds a reference to our dict object that holds all of the transcribe sessions.
    every x seconds, it checks to see if we have any streams that haven't been used in too long, and it kills them
    """
    def __init__(self, sessions, model=None, scorer=None):
        self.RATE_PROCESS = 16000 #16kHz sf for deepspeech open official model
        self.wait_time = 20 #amount of seconds to wait before killing a stream
        self.timeout_check_time = 5 #number seconds to check if a stream has gone over its timout time since last action
        self.timeout(sessions)
        if model is None:
            path = pathlib.Path(__file__).parent.absolute()
            model_path = os.path.join(path, "./deepspeech-0.8.2-models.pbmm")
            self.model = deepspeech.Model(model_path)
        else:
            self.model = deepspeech.Model(model)
        if scorer is None:
            path = pathlib.Path(__file__).parent.absolute()
            scorer_path = os.path.join(path, "./deepspeech-0.8.2-models.scorer")
            self.model.enableExternalScorer(scorer_path)
        else:
            self.model.enableExternalScorer(scorer)
    
    #create a new deepspeech stream and return to the caller
    def new_stream(self):
        return self.model.createStream()

    def kill_stream(self, stream):
        stream.finishStream()
    
    def resample(self, data16, input_rate):
        """
        Microphone may not support our native processing sampling rate, so
        resample from input_rate to RATE_PROCESS here for webrtcvad and
        deepspeech

        Args:
            data (binary): Input audio stream
            input_rate (int): Input audio rate to resample from
        """
        #data16 = data #np.fromstring(string=data, dtype=np.int16)
        resample_size = int(len(data16) / input_rate * self.RATE_PROCESS)
        resample = signal.resample(data16, resample_size)
        resample16 = np.array(resample, dtype=np.int16)
        return resample16

    #take audio and a deepspeech stream instance, add the audio to the stream, and get the latest transcription
    def get_transcribe(self, frames, stream):
        stream.feedAudioContent(frames)
        result = stream.intermediateDecode()
        return result

    def timeout(self, sessions):
        """
        Check through all the sessions and kills any that have been alive for too long (too long is defined in __init__)
        Runs itself over and over on a set inverval
        """
        timeout_thread = threading.Timer(self.timeout_check_time, self.timeout, args=(sessions,))
        timeout_thread.daemon = True
        timeout_thread.start()
        for session in list(sessions):
            if session == "last_used_id":
                continue
            if time.time() - sessions[session]["last_timestamp"] > self.wait_time:
                print("Killing session #{}".format(session))
                self.kill_stream(sessions[session]["ds"])
                sessions.pop(session)
