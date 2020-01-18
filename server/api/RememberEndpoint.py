from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import voice_commands

class Remember(Resource):
    success_marshaller = {
            'success' : fields.Integer,
            }
    
    def __init__(self, app, jwt, PhraseManager):
        self.db = Database()
        self.db.connect()
        self.jwt = jwt
        self.PhraseManager = PhraseManager
        self.l1size = 4 #size of l1 cache
        self.command_manager = voice_commands.SpokenCommandManager()
 
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
    
    def handleCommands(self, userId, speech, stage, phrasesPass):
        cmd_index, remove = self.command_manager.parse_command(speech)
        phrases = phrasesPass.copy()

        if cmd_index is not None and remove is not None:
            stage_len = self.l1size #L1 stage size
            if remove is True and cmd_index < len(stage):
                stage.pop(cmd_index)
            elif remove is False and cmd_index < len(phrases):
                stage.insert(0, phrases.pop(cmd_index))
                if len(stage) > stage_len:
                    stage = stage[:stage_len]
        self.db.saveL1Stage(userId, stage)
        return stage

    @marshal_with(success_marshaller)
    @jwt_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=type)
        parser.add_argument('phrases', type = list, location='json')
        args = parser.parse_args()
        
        username = get_jwt_identity()
        userId = str(self.db.nameToId(username))

        memType = args['type']
        sentPhrases = args['phrases']

        self.remember(userId, sentPhrases)
        
        phrases = self.db.getPhrases(userId)
        stage = self.db.getL1Stage(userId)
        
        stage = self.handleCommands(userId, sentPhrases[0]['speech'], stage, phrases)
        self.PhraseManager.ping(userId, phrases, stage)

        return { "success" : 1 }
