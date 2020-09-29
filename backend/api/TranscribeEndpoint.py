from flask_restful import Resource
from flask import request
import struct

class Transcribe(Resource):
    def __init__(self, sessions, transcriber):
        self.sessions = sessions
        self.transcriber = transcriber
        #audio and transcription globals
        self.sf_i = 48000 #incoming sampling frequency
        self.sf_ds = 16000 #deep speech sampling frequency

    def parse_transcribe_request(self, raw_req):
        #parse incoming byte string
        len_buf = len(raw_req) // 2
        format_string = "<{}h".format(len_buf)
        buf = struct.unpack_from(format_string, raw_req, offset=0)
        data = buf[:-2]
        idx = buf[-2]
        session_id = buf[-1]
        return data, idx, session_id

    def get_transcript(self, buf, ds):
        #get transcript
        #resample to 16kHz from provided sampling rate
        ds_buf = self.transcriber.resample(buf, self.sf_i)
        transcript = self.transcriber.get_transcribe(ds_buf, ds)
        return transcript

    def post(self):
        #get the datastream from the body, parse it, add it to the deepspeech stream, get a transcription, and send the trasncription back to the user
        data, idx, session_id = self.parse_transcribe_request(request.data)
        transcript = self.get_transcript(data, self.sessions[session_id]["ds"])
        return {"transcript" : transcript} #send the latest transcript text

    def get(self):
        #create a new session id for this request, as well as new deepspeech stream (which will be closed on timeout of when the user sends a session close ping)
        session_id = (self.sessions["last_used_id"] + 1) % 65536 #get the last used id incremented by one (wrap around mod)
        self.sessions["last_used_id"] += 1 #increment that last used id
        self.sessions[session_id] = dict()
        self.sessions[session_id]["ds"] = self.transcriber.new_stream()
        print(self.sessions)
        return {"session_id" : session_id}
