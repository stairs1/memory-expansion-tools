from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import time


class L2(Resource):
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

    @marshal_with(ltwo_marshaller)
    @jwt_required
    def get(self):
        print("******************************************")
        parser = reqparse.RequestParser()
        parser.add_argument("startDate", required=False, location="args")
        parser.add_argument("endDate", required=False, location="args")
        args = parser.parse_args()

        print("******************************************")
        try:
            startDate = int(args["startDate"])
            endDate = int(args["endDate"])
            dates = True
        except:
            dates = False
  
        username = get_jwt_identity()
        userId = self.db.nameToId(username)
        print("******************************************")

        if dates:
            cache = self.db.getL(userId, time.time(), level=2, startDate=startDate, endDate=endDate)
        else:
            cache = self.db.getL(userId, time.time(), level=2)
        results = list()
        for item in cache:
            item["prettyTime"] = datetime.fromtimestamp(item["timestamp"]).strftime(
                "%a, %b %-d %-I:%M %p"
                )
            results.append(item)
        headers = {"Content-Type": "application/json"}
        return results
