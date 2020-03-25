from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity


class SearchPage(Resource):
    talk_marshaller = {
        "userId": fields.String,
        "talk": fields.String(default="Anonymous User"),
        "timestamp": fields.Float,
        "_id": fields.String,
        "prettyTime": fields.String,
        "latitude": fields.Float,
        "longitude": fields.Float,
        "address": fields.String
    }

    def __init__(self, jwt):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument("time", type=str)
        self.parser.add_argument("userId", type=str, location="form")
        self.parser.add_argument("phrases", type=list, location="json")
        self.db = Database()
        self.db.connect()
        self.jwt = jwt

    def get(self):
        headers = {"Content-Type": "text/html"}
        return make_response(render_template("searchbasic.html"), 200, headers)

    @marshal_with(talk_marshaller)
    @jwt_required
    def post(self):
        username = get_jwt_identity()
        userId = str(self.db.nameToId(username))
        args = self.parser.parse_args()
        reqTime = args["time"]
        if reqTime is None or reqTime == "" or reqTime.isspace() or reqTime == "0":
            reqTime = None
        else:
            reqTime = "2020-" + reqTime
            reqTime = datetime.timestamp(datetime.strptime(reqTime, "%Y-%m-%d"))

        result = list()  # hold db results
        for item in args["phrases"]:
            data = item["speech"]
            r = self.db.search(userId, data, queryTime=reqTime)
            for item in r:
                print(item)
                item["prettyTime"] = datetime.fromtimestamp(item["timestamp"]).strftime(
                    "%a, %b %-d %-I:%-M %p"
                )
                result.append(item)

        return result
