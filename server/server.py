# flask
from flask import Flask, render_template, flash, redirect, jsonify
from flask import request
from flask_restful import Api
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

# custom stuff
from db import Database
from api.SearchEndpoint import SearchPage
from api.TimeFlowEndpoint import TimeFlow
from api.L1Endpoint import L1
from api.RememberEndpoint import Remember
from api.LoginEndpoint import Login
from api.RefreshTokenEndpoint import Refresh
from api.SignUpEndpoint import SignUp
from api.L2Endpoint import L2
from api.L3Endpoint import L3
from api.ToDoEndpoint import ToDo
from api.PhraseUpdate import PhraseSocket

# app setup
app = Flask(__name__)
app.debug = True
app._static_folder = os.path.abspath("templates/static/")
app.config["JWT_SECRET_KEY"] = "extendedmind"

api = Api(app)  # flask_restful
jwt = JWTManager(app)  # flask_jwt_extended
bcrypt = Bcrypt(app)  # bcrypt password hashing
CORS(app)

app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]

# start/attach everything
phraseSock = PhraseSocket(app)
api.add_resource(Login, "/loginapi", resource_class_args=[bcrypt, jwt])
api.add_resource(L1, "/lone", resource_class_args=[jwt])
api.add_resource(SearchPage, "/searchapi", resource_class_args=[jwt])
api.add_resource(TimeFlow, "/timeflow", resource_class_args=[jwt])
api.add_resource(Remember, "/remember", resource_class_args=[app, jwt, phraseSock])
api.add_resource(SignUp, "/signupapi", resource_class_args=[bcrypt])
api.add_resource(L2, "/ltwo")
api.add_resource(L3, "/lthree")
api.add_resource(ToDo, "/todo")
api.add_resource(Refresh, "/refresh", resource_class_args=[jwt])

##catch all to direct all other routes to react frontend
#@app.route('/', defaults={'path': ''})
#@app.route('/<path:path>')
#def catch_all(path):
#    print("*****************FFFFFFFFFFFFFFFFFFFFFFFFF**************************")
#    path_dir = os.path.abspath("frontend/build") #path react build
#    if path != "" and os.path.exists(os.path.join(path_dir, path)):
#        print(os.path.join(path_dir), path)
#        return send_from_directory(os.path.join(path_dir), path)
#    else:
#        print(os.path.join(path_dir),'index.html')
#        return send_from_directory(os.path.join(path_dir),'index.html')

# for dev server
def start():
    app.run(debug=True)

if __name__ == "__main__":
    start()
