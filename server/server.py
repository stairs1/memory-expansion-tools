#flask
from flask import Flask, render_template, flash, redirect, jsonify
from flask import request
from flask_restful import Api
from bson.json_util import dumps

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
from Cache import Cache

app = Flask(__name__)
app.debug=True
app._static_folder = os.path.abspath("templates/static/")
app.config['SECRET_KEY'] = 'super special secret'

api = Api(app) #flask_restful

def start():
    cache = Cache()
    phraseSock = PhraseSocket(app, cache)
    
    api.add_resource(Main, '/')
    api.add_resource(SearchPage, '/search')
    api.add_resource(TimeFlow, '/timeflow')
    api.add_resource(Remember, '/remember', resource_class_args=[app, cache])
    app.run()

if __name__ == "__main__":
    start()
