#flask
from flask import Flask, render_template, flash, redirect, jsonify
from flask import request
from flask_restful import Api
from bson.json_util import dumps
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_bcrypt import Bcrypt

#regular stuff
import json
from time import sleep
import os
import threading

#custom stuff
from db import Database
from api.SearchEndpoint import SearchPage
from api.TimeFlowEndpoint import TimeFlow
from api.L1Endpoint import L1
from api.RememberEndpoint import Remember
from api.PhraseUpdate import PhraseSocket
from api.LoginEndpoint import Login

app = Flask(__name__)
app.debug=True
app._static_folder = os.path.abspath("templates/static/")
app.config['JWT_SECRET_KEY'] = 'extendedmind'

api = Api(app) #flask_restful
jwt = JWTManager(app) #flask_jwt_extended
bcrypt = Bcrypt(app) #bcrypt password hashing

app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']

phraseSock = PhraseSocket(app)
api.add_resource(Login, '/', resource_class_args=[bcrypt, jwt])
api.add_resource(L1, '/L1', resource_class_args=[jwt])
api.add_resource(SearchPage, '/search', resource_class_args=[jwt])
api.add_resource(TimeFlow, '/timeflow', resource_class_args=[jwt])
api.add_resource(Remember, '/remember', resource_class_args=[app, jwt, phraseSock])

def start():
    app.run()

if __name__ == "__main__":
    start()
