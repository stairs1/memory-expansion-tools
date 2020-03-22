from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity


class TimeFlow(Resource):
    talk_marshaller = {
        "userId": fields.String,
        "talk": fields.String(default="Anonymous User"),
        "timestamp": fields.Float,
        "_id": fields.String,
        "prettyTime": fields.String,
    }

    def __init__(self, jwt):
        self.db = Database()
        self.db.connect()
        self.jwt = jwt

    def get(self):
        """parser = reqparse.RequestParser()
        parser.add_argument('talkId', type=str)
        parser.add_argument('userId', type=str)
        args = parser.parse_args()

        talkId = args['talkId']
        userId = args['userId']
        
        talks, talkId = self.db.timeFlow(userId, talkId, 30) #default value to pass is 86400 seconds in day
        if talks is None: talks = [] #TODO make this cleaner

        for talk in talks:
            talk['prettyTime'] = datetime.fromtimestamp(talk['timestamp']).strftime("%a, %b %-d %-I:%-M %p")
            
        """
        headers = {"Content-Type": "text/html"}
        return make_response(
            render_template("timeflow.html"), 200, headers
        )

    @marshal_with(talk_marshaller)
    @jwt_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("talkId", type=str, required=False)
        parser.add_argument("timeFrame", type=float)

        username = get_jwt_identity()
        userId = str(self.db.nameToId(username))

        args = parser.parse_args()

        talkId = args["talkId"]
        timeFrame = args["timeFrame"]

        if talkId is None:
            results, talkId = self.db.timeFlow(userId, timeFrame=timeFrame)
        else:
            results, talkId = self.db.timeFlow(userId, talkId, timeFrame)

        for result in results:
            result["prettyTime"] = datetime.fromtimestamp(result["timestamp"]).strftime(
                "%a, %b %-d %-I:%-M %p"
            )

        return results
