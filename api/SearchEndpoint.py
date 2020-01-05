from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database
from datetime import datetime

class SearchPage(Resource):
    talk_marshaller = {
            'userId' : fields.String,
            'talk' : fields.String(default='Anonymous User'),
            'timestamp' : fields.Float,
            '_id' : fields.String,
            'prettyTime' : fields.String
            }
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('time', type=str)
        self.parser.add_argument('userId', type=str, location='form')
        self.parser.add_argument('phrases', type=list, location='json')
        self.db = Database()
        self.db.connect()
    
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('searchbasic.html'), 200, headers)

    @marshal_with(talk_marshaller)
    def post(self):
        temp_uid = "5e0e6e1807cdcbd6a097708d"
        args = self.parser.parse_args()
        reqTime = args['time']
        if reqTime == "" or reqTime.isspace() or reqTime == '0':
            reqTime = None
        else:
            reqTime = "2020-" + reqTime
            print(reqTime)
            reqTime = datetime.timestamp(datetime.strptime(reqTime, "%Y-%m-%d"))
            print(reqTime)

        result = list() #hold db results
        for item in args['phrases']:
            data = item['speech']
            r = self.db.search(temp_uid, data, queryTime=reqTime)
            for item in r:
                print(item)
                item['prettyTime'] = datetime.fromtimestamp(item['timestamp']).strftime("%a, %b %-d %-I:%-M %p")
                result.append(item)

        return result

