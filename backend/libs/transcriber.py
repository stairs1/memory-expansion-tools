import time, logging
import deepspeech
import numpy as np
from scipy import signal
import pathlib
import os

class Transcriber:
    def __init__(self, model=None, scorer=None):
        self.RATE_PROCESS = 16000 #16kHz sf for deepspeech open official model
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
