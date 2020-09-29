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
        username = get_jwt_identity()
        userId = self.db.nameToId(username)
        cache = self.db.getL(userId, time.time(), level=2)
        print(cache)
        results = list()
        for item in cache:
            item["prettyTime"] = datetime.fromtimestamp(item["timestamp"]).strftime(
                "%a, %b %-d %-I:%M %p"
                )
            results.append(item)
        headers = {"Content-Type": "application/json"}
        return results
