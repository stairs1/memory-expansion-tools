from flask_restful import Resource
from flask import request
import time
import struct

class Transcribe(Resource):
    def __init__(self, transcribemanager):
        self.transcribemanager = transcribemanager

    def parse_transcribe_request(self, raw_req):
        #parse incoming byte string
        len_buf = len(raw_req) // 2
        format_string = "<{}h".format(len_buf)
        buf = struct.unpack_from(format_string, raw_req, offset=0)
        chunk = buf[:-2] #audio chunk
        idx = buf[-2]
        session_id = buf[-1]
        return chunk, idx, session_id

    def post(self):
        print("TRANSCRIBE POST")
        #get the datastream from the body, parse it, add it to the deepspeech stream, get a transcription, and send the trasncription back to the user
        chunk, idx, session_id = self.parse_transcribe_request(request.data)
        print(idx, session_id)
        #give the new audio chunk to the transcrive manager
        self.transcribemanager.feed_audio(chunk, idx, session_id)
        #get latest transcription
        transcript = self.transcribemanager.get_transcript(session_id)
        return {"transcript" : transcript} #send the latest transcript text

    def get(self):
        print("START TRANCRIVE SESSIONS")
        session_id = self.transcribemanager.new_session()
        print(session_id)
        return {"session_id" : session_id}
