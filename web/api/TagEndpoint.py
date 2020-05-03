from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from flask_jwt_extended import jwt_required, get_jwt_identity

class TagEndpoint(Resource):
    success_marshaller = {
        "success": fields.Integer,
    }

    tag_marshaller = {
        "success": fields.Integer,
        "tags": fields.List,
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

    #@marshal_with(tag_marshaller)
    def get(self):
        username = "cayden" #get_jwt_identity()
        tags = self.db.getTags(username)
        resp = dict()
        if tags:
            resp["success"] = 1
            resp["tags"] = tags
        else:
            resp["success"] = 0
        print(resp)
        return resp



