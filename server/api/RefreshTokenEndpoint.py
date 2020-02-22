from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_refresh_token_required

class Refresh(Resource):
    refresh_marshaller = {
            'success' : fields.Integer,
            'token' : fields.String,
        }

    def __init__(self, jwt):
        self.jwt = jwt

    @marshal_with(refresh_marshaller)
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user, fresh=False)
        resp = {'success' : 1, 'token': new_token}
        return resp
