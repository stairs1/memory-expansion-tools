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
from api.MainEndpoint import Main
from api.RememberEndpoint import Remember
from api.PhraseSocket import PhraseSocket
from api.LoginEndpoint import Login
from Cache import Cache

app = Flask(__name__)
app.debug=True
app._static_folder = os.path.abspath("templates/static/")
app.config['JWT_SECRET_KEY'] = 'extendedmind'

api = Api(app) #flask_restful
jwt = JWTManager(app) #flask_jwt_extended
bcrypt = Bcrypt(app) #bcrypt password hashing

cache = Cache()
phraseSock = PhraseSocket(app, cache)

#api.add_resource(Main, '/')
api.add_resource(Login, '/', resource_class_args=[bcrypt, jwt])
api.add_resource(SearchPage, '/search', resource_class_args=[jwt])
api.add_resource(TimeFlow, '/timeflow', resource_class_args=[jwt])
api.add_resource(Remember, '/remember', resource_class_args=[app, jwt, cache])

def start():
        app.run()

if __name__ == "__main__":
    start()
