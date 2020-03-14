from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import voice_commands


class Remember(Resource):
    success_marshaller = {
        "success": fields.Integer,
    }

    def __init__(self, app, jwt, PhraseManager):
        self.db = Database()
        self.db.connect()
        self.jwt = jwt
        self.PhraseManager = PhraseManager
        self.l1size = 4  # size of l1 cache
        self.command_manager = voice_commands.SpokenCommandManager()

    def remember(self, userId, phraseList, latitude, longitude, address):
        for phrase in phraseList:
            timestamp = float(phrase["timestamp"])
            speech = phrase["speech"]
            if self.checkData(speech):
                resp = self.db.addTalk(userId, speech, timestamp, latitude, longitude, address)
                print(resp)

    def checkData(self, phrase):
        # do not accept empty strings or whitespace
        if phrase == "" or phrase.isspace() or phrase is None:
            return False
        else:
            return True

    def handleStageCommands(self, userId, speech, stage, phrasesPass):
        cmd_index, remove = self.command_manager.parse_stage_command(speech)
        phrases = phrasesPass.copy()

        if cmd_index is not None and remove is not None:
            cmd = True
            stage_len = self.l1size  # L1 stage size
            if remove is True and cmd_index < len(stage):
                stage.pop(cmd_index)
            elif remove is False and cmd_index < len(phrases):
                stage.insert(0, phrases.pop(cmd_index))
                if len(stage) > stage_len:
                    stage = stage[:stage_len]
        else:
            cmd = False  # this var represent whether or not this was a command

        self.db.saveL1Stage(userId, stage)
        return stage, cmd

    def handleCacheCommands(self, phrasePass, userId, latitude, longitude, address):
        cmd_index, phrase = self.command_manager.parse_cache_command(
            phrasePass["speech"]
        )
        if cmd_index:
            self.db.addTalk(userId, phrase, phrasePass["timestamp"], latitude, longitude, address, cache=cmd_index)
        return phrase

    @marshal_with(success_marshaller)
    @jwt_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("type", type=type)
        parser.add_argument("phrases", type=list, location="json")
        parser.add_argument("lat", type=float)
        parser.add_argument("long", type=float)
        parser.add_argument("address", type=str)
        args = parser.parse_args()

        username = get_jwt_identity()
        userId = str(self.db.nameToId(username))

        memType = args["type"]
        latitude = args["lat"]
        longitude = args["long"]
        address = args["address"]
        sentPhrases = args["phrases"]

        phrases = self.db.getPhrases(userId)
        stage = self.db.getL1Stage(userId)

        # check if it is a command for our working memory (L1) stage
        stage, cmd = self.handleStageCommands(
            userId, sentPhrases[0]["speech"], stage, phrases
        )

        # if not a stage command, check if it's a L2, L3, or annotation command
        if not cmd:
            phraseTmp = self.handleCacheCommands(sentPhrases[0], userId, latitude, longitude, address)
            if (
                phraseTmp is not None
            ):  # if it is a command, take the parsed phrase and use that instead
                sentPhrases[0]["speech"] = phraseTmp
            self.remember(userId, sentPhrases, latitude, longitude, address)  # remember this in our talks database
            # logic to move the phrases around so we don't have to query db again
            phrases.insert(0, sentPhrases[0]["speech"])
            phrases = phrases[:-1]

        # notify the PhraseManager so it can update the frontend if need be
        self.PhraseManager.ping(userId, phrases, stage)

        return {"success": 1}
