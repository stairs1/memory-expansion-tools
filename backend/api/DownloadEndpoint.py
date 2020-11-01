from flask import render_template, make_response, Response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from flask_jwt_extended import jwt_required, get_jwt_identity
import tempfile
import time

class Download(Resource):
    def __init__(self, app, jwt):
        self.db = Database()
        self.db.connect()
        self.jwt = jwt

    @jwt_required
    def get(self):
        username = get_jwt_identity()
        parser = reqparse.RequestParser()
        parser.add_argument("startDate", required=False, location="args")
        parser.add_argument("endDate", required=False, location="args")
        args = parser.parse_args()

        try:
            startDate = int(args["startDate"])
            endDate = int(args["endDate"])
            dates = True
        except:
            dates = False

        username = get_jwt_identity()
        userId = self.db.nameToId(username)

        if dates:
            cache = self.db.getL(userId, time.time(), level=2, startDate=startDate, endDate=endDate)
        else:
            cache = self.db.getL(userId, time.time(), level=2)
            endDate = time.time()
            startDate = endDate - 86400

        def generate_download():
            #create a virtual file for to send to the user
            download_file = open("tmpfile.csv", "w") #tempfile.TemporaryFile(mode="w")
            keys = ["timestamp", "talk", "latitude", "longitude", "address"]
            yield "timestamp,speech,latitude,longitude,address\n"
            for item in cache:
                save_str = ""
                for key in keys:
                    save_str += str(item[key]) + ","
                save_str = save_str[:-1] #remove last comma
                save_str += "\n"
                yield save_str

        resp = Response(generate_download(),mimetype="txt/plain")
        resp.headers['Content-Disposition'] =  "attachment; filename=\"mxt_download_{}_{}.csv\"".format(startDate, endDate)
        resp.headers['Access-Control-Expose-Headers'] = "Content-Disposition"
        return resp









