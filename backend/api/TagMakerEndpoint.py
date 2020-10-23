from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from flask_jwt_extended import jwt_required, get_jwt_identity

class TagMaker(Resource):
    success_marshaller = {
        "success": fields.Integer,
    }

    def __init__(self, app, jwt):
        self.db = Database()
        self.db.connect()
        self.jwt = jwt

    @marshal_with(success_marshaller)
    @jwt_required
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("tag", type=str)
        args = parser.parse_args()

        tag = args["tag"]

        username = get_jwt_identity()
        userId = self.db.nameToId(username)

        self.db.addTag(username, tag)

        return {"success": 1}
