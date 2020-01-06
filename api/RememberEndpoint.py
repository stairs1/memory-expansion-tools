from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime

class Remember(Resource):
    success_marshaller = {
            'success' : fields.Integer,
            }
    
    def __init__(self, app, cache):
        self.db = Database()
        self.db.connect()
        self.cache = cache
 
    def remember(self, userId, phraseList): 
        for phrase in phraseList:
            timestamp = phrase['timestamp']
            speech = phrase['speech']
            if self.checkData(speech):
                resp = self.db.addTalk(userId, speech, timestamp)
                print(resp)

    def checkData(self, phrase):
        # do not accept empty strings or whitespace
        if phrase == '' or phrase.isspace() or phrase is None:
            return False
        else:
            return True

    @marshal_with(success_marshaller)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str)
        parser.add_argument('type', type=type)
        parser.add_argument('phrases', type = list, location='json')
        
        temp_uid = "5e0e6e1807cdcbd6a097708d"
        
        args = parser.parse_args()
        
        userId = args['userId']
        memType = args['type']
        phrases = args['phrases']

        self.cache.speech = phrases[0]['speech']
        self.cache.dataReady = True
        
        self.remember(temp_uid, phrases)

        return { "success" : 1 }
