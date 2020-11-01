from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
    set_access_cookies,
    create_refresh_token,
)


class SignUp(Resource):
    signup_marshaller = {
        "success": fields.Integer,
    }

    def __init__(self, bcrypt):
        self.db = Database()
        self.db.connect()
        self.bcrypt = bcrypt

    def get(self):
        headers = {"Content-Type": "text/html"}
        return make_response(render_template("signup.html"), 200, headers)

    @marshal_with(signup_marshaller)
    def post(self):  # NOTE that this is actually using username and not userId...
        print("POOOOSTTTTTTTTTTTT TOOOOOOOOOOOO SIIIIIIIIGGGGGGGGGGGGGNNNNNNNNUUUUUUUUUPPPPPPP")
        # define args to accepts from post
        parser = reqparse.RequestParser()
        parser.add_argument("username", type=str)
        parser.add_argument("password", type=str)
        parser.add_argument("email", type=str)
        parser.add_argument("name", type=str)
        args = parser.parse_args()
        # check if user exists and verify their password
        username = args["username"]
        userId = self.db.nameToId(username)
        password = args["password"]
        email = args["email"]
        name = args["name"]

        if self.db.userExists(userId): #userId belongs to someone else
            return {"success" : 0}

        hashword = self.bcrypt.generate_password_hash(password)
        user = self.db.addUser(name, username, email, hashword.decode("utf-8")) 
        if user is not None:
            return {"success" : 1}

        return {"success" : 0} # something went wrong
