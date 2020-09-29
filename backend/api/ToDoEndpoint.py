from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import time


class ToDo(Resource):
    def __init__(self):
        self.db = Database()
        self.db.connect()

    @jwt_required
    def get(self):
        username = get_jwt_identity()
        userId = self.db.nameToId(username)
        cache = self.db.getL(userId, time.time(), level=-2)
        headers = {"Content-Type": "text/html"}
        return make_response(render_template("todo.html", data=cache), 200, headers)
