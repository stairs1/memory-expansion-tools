import time
import deepspeech
import numpy as np
import threading
from scipy import signal
import pathlib
import os

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
        print("chunk idx: {}".format(idx))
        self.data[idx] = chunk
        self.synclist.append(idx)
        self.synclist = sorted(self.synclist)
        if self.synclist[0] == (self.last_idx + 1): #if the smallest chunk id is one greater than the last sent chunk
            synced_chunks = [self.data[self.synclist[0]]]
            for i, nxt_idx in enumerate(self.synclist[1:]):
                if nxt_idx == (self.last_idx + i + 2): #keep grabbing chunks if they are sequential after the first one
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
            return synced_chunks
        elif (self.synclist[0] + self.max_spacing) < idx: #if the smallest chunk is max_space smaller the last sent chunk, then clear the buffer and resync
                unsynced_chunks = list()
                for i, nxt_idx in enumerate(self.synclist):
                    unsynced_chunks.append(self.data[nxt_idx])
                #reset our holder to nothing now that we've emptied our buffers
                self.data = dict()
                self.last_idx = idx
                self.synclist = list()
                return unsynced_chunks
        else: 
            return None

class Transcriber:
    """
    Stateful layer to hold audio data and interface with deepspeech.

    A wrapper around the deepspeech stream class which allows for audio buffering, state saving, more efficient transcription (only transcribe where there is new data), etc. The most import part is the buffer: which is implement in the Buf class
            """
    def __init__(self, model=None):
        self.RATE_PROCESS = 16000 #16kHz sf for deepspeech open official model
        self.sf_i = 44100
        self.new = False #is there new audio to transcribe?
        self.transcribe_period = 1 #min time to wait to transcribe
        self.recent = 0 #count how recently we've made a transcription, should never transcribe more than self.rate times per second
        self.transcribe = "" #hold the current transcription
        self.buf = Buf() #create a new buffer to hold audio frames while syncing, and pass it back to caller
        self.model = model
        self.stream = self.model.createStream() #new deepspeech stream
        self.deepspeech_lock = threading.Lock()
            
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
        #resample chunk
        ds_chunk = np.array(chunk, dtype=np.int16)
        #push the latest frames into the buffer, get back any newly synced chunks
        latest_chunks = self.buf.feed_and_pop(ds_chunk, idx)
        #if we have the some new audio that is in order (based on idx) feed that to the deepspeech steram
        if latest_chunks is not None:
            #if we fed new audio, set 'new' to true, so get_transcribe knows to retranscribe
            self.new = True
            #use multithreading so we can use a Lock/Mutex so we don't call deepspeech functions multiple times, breaking shit
            self.deepspeech_lock.acquire()
            for new_chunk in latest_chunks:
                #feed in sub chunk that are smaller so deepspeech doesn't kill itself (OOM?... I don't know -Cayden)
                sub_chunk_size = 1600 
                for i, _ in enumerate(new_chunk[::sub_chunk_size]):
                    sub_chunk = new_chunk[i*sub_chunk_size:(i*sub_chunk_size)+sub_chunk_size]
                    self.stream.feedAudioContent(sub_chunk)
            self.deepspeech_lock.release()

    #feed chunks to deepspeech stream
    def feed_ds(self, latest_chunks):
        self.deepspeech_lock.acquire()
        for chunk in latest_chunks:
            self.stream.feedAudioContent(chunk)
        self.deepspeech_lock.release()

    #get the latest transcription
    def get_transcript(self):
        if self.new and (self.recent <= (time.time() - self.transcribe_period)):
            self.new = False
            self.recent = time.time()
            #use multithreading so we can use a Lock/Mutex so we don't call deepspeech functions multiple times, breaking shit
            self.deepspeech_lock.acquire()
            self.transcribe = self.stream.intermediateDecode()
            self.deepspeech_lock.release()
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
        self.wait_time = 60 #amount of seconds to wait before killing a stream
        self.timeout_check_time = 20 #number seconds to check if a stream has gone over its timout time since last action
        self.timeout() #continues to repeat indefinitly
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

    def end_session(self, session_id):
        self.sessions[session_id]["ts"].kill()
        self.sessions.pop(session_id)

    #create a new transcriber and return to the caller
    def new_session(self):
         #create a new session id for this request, as well as new deepspeech stream (which will be closed on timeout of when the user sends a session close ping)
        session_id = (self.sessions["last_used_id"] + 1) % 65536 #get the last used id incremented by one (wrap around mod)
        self.sessions["last_used_id"] += 1 #increment that last used id
        self.sessions[session_id] = dict()
        self.sessions[session_id]["ts"] = Transcriber(self.model)
        self.sessions[session_id]["last_timestamp"] = time.time()
        return session_id

    def feed_audio(self, chunk, idx, session_id):
        """
        Give the audio chunk to the appropriate Transcriber
        """
        self.sessions[session_id]["last_timestamp"] = time.time()
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
