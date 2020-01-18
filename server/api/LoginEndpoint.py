from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime
from bson.objectid import ObjectId
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, set_access_cookies

class Login(Resource):
    login_marshaller = {
            'success' : fields.Integer,
            'token' : fields.String,
            'message' : fields.String
        }

    def __init__(self, bcrypt, jwt):
        self.db = Database()
        self.db.connect()
        self.bcrypt = bcrypt
        self.jwt = jwt
    
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('login.html'), 200, headers)

    @marshal_with(login_marshaller)
    def post(self):
        #define args to accepts from post
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str)
        parser.add_argument('password', type=str)
        args = parser.parse_args()

        #check if user exists and verify their password
        userId = args['userId']
        password = args['password']
        
        apass = self.db.getPass(userId)
       
        hashword = self.bcrypt.generate_password_hash(password)
        print(hashword)
        resp = dict()
        
        if not apass is None and self.bcrypt.check_password_hash(apass, password):
            resp['success'] = 1
            resp['token'] = create_access_token(identity=userId)
            return resp
        
        resp['success'] = 0
        resp['message'] = "Those credentials don't look right."

        return resp #something went wrong
