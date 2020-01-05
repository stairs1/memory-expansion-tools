from flask import render_template, make_response
from flask_restful import Resource, reqparse, fields, marshal_with
from db import Database

class SearchPage(Resource):
    talk_marshaller = {
            'userId' : fields.String,
            'talk' : fields.String(default='Anonymous User'),
            'timestamp' : fields.Float,
            '_id' : fields.String
            }
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('type')
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
        result = list() #hold db results
        for item in args['phrases']:
            data = item['speech']
            r = self.db.search(temp_uid, data)
            for item in r:
                result.append(item)

        return result

