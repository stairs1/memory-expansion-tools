# flask
from flask import Flask, render_template, flash, redirect, jsonify
from flask import request
from flask_restful import Api
from flask_cors import CORS
from bson.json_util import dumps
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask import send_from_directory #for serving react

# regular stuff
import json
from time import sleep
import os
import threading

# custom - endpoints
from db import Database
from api.SearchEndpoint import SearchPage
from api.TimeFlowEndpoint import TimeFlow
from api.L1Endpoint import L1
from api.RememberEndpoint import Remember
from api.TagEndpoint import TagEndpoint
from api.LoginEndpoint import Login
from api.RefreshTokenEndpoint import Refresh
from api.SignUpEndpoint import SignUp
from api.L2Endpoint import L2
from api.RecentEndpoint import Recent 
from api.L3Endpoint import L3
from api.ToDoEndpoint import ToDo
from api.TranscribeEndpoint import Transcribe
from api.DownloadEndpoint import Download

#custom libs
from libs.transcriber import TranscribeManager
from libs.PhraseUpdate import PhraseSocket

# app setup
app = Flask(__name__)
CORS(app)
app.debug = True
app._static_folder = os.path.abspath("templates/static/")
app.config["JWT_SECRET_KEY"] = "supah#Mem1"

api = Api(app)  # flask_restful
jwt = JWTManager(app)  # flask_jwt_extended
bcrypt = Bcrypt(app)  # bcrypt password hashing
CORS(app)

app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]

#create the Transcription manager
transcribemanager = TranscribeManager()

# start/attach everything
phraseSock = PhraseSocket(app)
api.add_resource(Login, "/loginapi", resource_class_args=[bcrypt, jwt])
api.add_resource(L1, "/lone", resource_class_args=[jwt])
api.add_resource(SearchPage, "/searchapi", resource_class_args=[jwt])
api.add_resource(TimeFlow, "/timeflow", resource_class_args=[jwt])
api.add_resource(Remember, "/remember", resource_class_args=[app, jwt, phraseSock])
api.add_resource(TagEndpoint, "/tag", resource_class_args=[app, jwt])
api.add_resource(SignUp, "/signupapi", resource_class_args=[bcrypt])
api.add_resource(L2, "/ltwo")
api.add_resource(L3, "/lthree")
api.add_resource(ToDo, "/todo")
api.add_resource(Refresh, "/refresh", resource_class_args=[jwt])
api.add_resource(Recent, "/recent")
api.add_resource(Transcribe, "/transcribe", resource_class_args=[transcribemanager])
api.add_resource(Download, "/download", resource_class_args=[app, jwt])

# for dev server
def start():
    app.debug = True
    app.run(debug=True)

if __name__ == "__main__":
    start()
