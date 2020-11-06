import time, logging
import deepspeech
import numpy as np
import threading
from scipy import signal
import pathlib
import os
import struct
import time

class Buf:
    """
    Assistant to Transcriber.
    This buffer holds audio data for a Transcriber until it can be fed to a deepspeech stream. This is needed to ensure that audio packets are pushed into the deepspeech stream in order

    Buffer will only release audio samples if they are continuous with the previously released audio samples.

    This is sortof like windowing packets in TCP... actually that's what this is.

    We set a variable as the maximum spacing before we forget about a lost/dropped packet and move on.
    """
    def __init__(self, sf=16000):
        self.data = dict() #hold the audio chunks based on their indices
        self.synclist = list() #holds the audio chunk indicies in easy to sort data structure
        self.last_idx = -1 #the last index that we dropped because all data before it was synced, or because the max out-of-sync variable was reached
        self.max_spacing = 10 #10 packets

    def feed_and_pop(self, chunk, idx):
        """
        Take a new chunk of audio.
        If this new chunk makes a sequence of gapless audio chunks, return the chunks that are in order, and drop them.
        Or, it this makes the number of chunks in the queue since last gap greater than the max spacing, return data and drop it.
        """
        self.data[idx] = chunk
        self.synclist.append(idx)
        self.synclist = sorted(self.synclist)
        print("SYNCLIST: ")
        print(self.synclist)
        print(self.last_idx)
        for idx in self.synclist:
            with open("latestaudio.raw", "ba+") as f:
                b_data = struct.pack("<{}h".format(len(self.data[idx])), *self.data[idx])
                f.write(b_data)
        if self.synclist[0] == (self.last_idx + 1): #if the smallest chunk id is one greater than the last sent chunk
            synced_chunks = [self.data[self.synclist[0]]]
            for i, nxt_chunk in enumerate(self.synclist[1:]):
                if nxt_chunk == (self.last_idx + i + 2): #keep grabbing chunks if they are sequential after the first one
                    synced_chunks.append(self.data[nxt_idx])
            #drop these keys from our data holder
            to_drop = self.synclist[:len(synced_chunks)]
            for key in to_drop:
                self.data.pop(key, None)
            #drop these entries from our synced list
            self.synclist = self.synclist[len(synced_chunks):]
            #update the last synced holder
            self.last_idx += len(synced_chunks)
            #return the latest synced up audio chunks
            print("Len of synced_chunks is {}".format(len(synced_chunks)))
            print("Len of one synced_chunks is {}".format(len(synced_chunks[0])))
            return synced_chunks
        return None

class Transcriber:
    """
    Stateful layer to hold audio data and interface with deepspeech.

    A wrapper around the deepspeech stream class which allows for audio buffering, state saving, more efficient transcription (only transcribe where there is new data), etc. The most import part is the buffer: which is implement in the Buf class
            """
    def __init__(self, model=None, scorer=None):
        self.RATE_PROCESS = 16000 #16kHz sf for deepspeech open official model
        self.new = False #is there new audio to transcribe?
        self.transcribe = "" #hold the current transcription
        self.buf = Buf() #create a new buffer to hold audio frames while syncing, and pass it back to caller
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
        self.stream = self.model.createStream() #new deepspeech stream
            
    #resamples audio if to 16kHz for deepspeech, if needed
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

    #take audio and a deepspeech stream instance, add the audio to the stream buffer
    def feed_chunk(self, chunk, idx):
        print("THE TYPE AND LEN OF THE PASSED IN CHUNK IS")
        print(type(chunk))
        print(len(chunk))
        #push the latest frames into the buffer, get back any newly synced chunks
        latest_synced_chunks = self.buf.feed_and_pop(chunk, idx)
        #if we have the some new audio that is in order (based on idx) feed that to the deepspeech steram
        if latest_synced_chunks is not None:
            #if we fed new audio, set 'new' to true, so get_transcribe knows to retranscribe
            new = True
            for new_chunk in latest_synced_chunks:
                print("THE TYPE AND LEN OF RETURNED CHUNK IS")
                print(type(new_chunk))
                print(len(new_chunk))
                print("feading")
                chunk_resampled = self.resample(new_chunk, 16000)
                self.stream.feedAudioContent(chunk_resampled)

    #get the latest transcription
    def get_transcript(self):
        if self.new:
            self.new = False
            self.transcribe = self.stream.intermediateDecode()
        return self.transcribe

    def kill(self):
        self.stream.freeStream()

class TranscribeManager:
    """
    Manages all of the transcriptions sessions.

    holds a reference to our dict object that holds all of the transcribe sessions.
    every x seconds, it checks to see if we have any streams that haven't been used in too long, and it kills them

    Holds a reference to a deepspeech model instance, which is passed to Transcriber objects that are being managed.
    """
    def __init__(self, model=None, scorer=None):
        self.sessions = dict()
        #hold transcription sessions and the deepspeech model class statefully here, then the endpoint is stateless
        self.sessions["last_used_id"] = -1
        self.wait_time = 20 #amount of seconds to wait before killing a stream
        self.timeout_check_time = 5 #number seconds to check if a stream has gone over its timout time since last action
        #self.timeout() #continues to repeat indefinitly
        
    def end_session(self, session_id):
        self.sessions[session_id]["ts"].kill()
        self.sessions.pop(session_id)

    #create a new transcriber and return to the caller
    def new_session(self):
         #create a new session id for this request, as well as new deepspeech stream (which will be closed on timeout of when the user sends a session close ping)
        session_id = (self.sessions["last_used_id"] + 1) % 65536 #get the last used id incremented by one (wrap around mod)
        self.sessions["last_used_id"] += 1 #increment that last used id
        self.sessions[session_id] = dict()
        self.sessions[session_id]["ts"] = Transcriber()
        self.sessions[session_id]["last_timestamp"] = time.time()
        return session_id

    def feed_audio(self, chunk, idx, session_id):
        """
        Give the audio chunk to the appropriate Transcriber
        """
        self.sessions[session_id]["ts"].feed_chunk(chunk, idx)

    def get_transcript(self, session_id):
        """
        Get the latest transcript from the appropriate Transcriber
        """
        transcript = self.sessions[session_id]["ts"].get_transcript()
        return transcript

    def timeout(self):
        """
        Check through all the sessions and kills any that have been alive for too long (too long is defined in __init__)
        Runs itself over and over on a set inverval
        """
        timeout_thread = threading.Timer(self.timeout_check_time, self.timeout)
        timeout_thread.daemon = True
        timeout_thread.start()
        for session_id in list(self.sessions):
            if session_id == "last_used_id":
                continue
            if time.time() - self.sessions[session_id]["last_timestamp"] > self.wait_time:
                self.end_session(session_id)
