from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import time


class Recent(Resource):
    ltwo_marshaller = {
        "userId": fields.String,
        "talk": fields.String(default="Anonymous User"),
        "timestamp": fields.Float,
        "_id": fields.String,
        "prettyTime": fields.String,
        "latitude": fields.Float,
        "longitude": fields.Float,
        "address": fields.String
    }

    def __init__(self):
        self.db = Database()
        self.db.connect()

    #difference between GET and POST is POST allow you to select how many memories you want to retrieve
    @marshal_with(ltwo_marshaller)
    @jwt_required
    def get(self):
        username = get_jwt_identity()
        userId = self.db.nameToId(username)

        phrases = self.db.getPhrases(username)

        results = list()
        for item in phrases:
            item["prettyTime"] = datetime.fromtimestamp(item["timestamp"]).strftime(
                "%a, %b %-d %-I:%M %p"
                )
            results.append(item)
        headers = {"Content-Type": "application/json"}
        return results

    @marshal_with(ltwo_marshaller)
    @jwt_required
    def post(self):
        # define args to accepts from post
        parser = reqparse.RequestParser()
        parser.add_argument("numTalks", type=int)
        args = parser.parse_args()

        numTalks = args["numTalks"] #number of results we want passed back

        username = get_jwt_identity()
        userId = self.db.nameToId(username)

        phrases = self.db.getPhrases(username, num=numTalks)

        results = list()
        for item in phrases:
            item["prettyTime"] = datetime.fromtimestamp(item["timestamp"]).strftime(
                "%a, %b %-d %-I:%M %p"
                )
            results.append(item)
        headers = {"Content-Type": "application/json"}
        return results
