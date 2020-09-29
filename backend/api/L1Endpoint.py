from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime


class L1(Resource):
    def __init__(self, jwt):
        self.jwt = jwt

    def get(self):
        headers = {"Content-Type": "text/html"}
        return make_response(render_template("convo.html"), 200, headers)
