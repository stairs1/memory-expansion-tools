from pymongo import MongoClient
from bson.objectid import ObjectId

from datetime import datetime
import time

class Database:
    def __init__(self, mongoAddress="mongodb://127.0.0.1:27017"):    
       self.mongoAddress = mongoAddress

    def connect(self):
        # connect to MongoDB
        mongo = MongoClient(self.mongoAddress)
        db = mongo.sam
        self.db = db

    def getStatus(self):
        # Issue the serverStatus command and print the results
        serverStatusResult = self.db.command("serverStatus")
        return serverStatusResult

    def addUser(self, name, email):
        usersCollection = self.db.users
        user = {
                "name" : name, 
                "email" : email,
                "timestamp" : time.time()
                }
        resp = usersCollection.insert_one(user)
        userId = resp.inserted_id
        return userId
        
    def addTalk(self, userId, words, timestamp):
        if not self.userExists(userId):
            return "No such user exists, exiting" #TODO throw error

        talksCollection = self.db.talks
        talk = {
                "userId" : userId,
                "talk" : words,
                "timestamp" : timestamp
                }
        
        if talk in talksCollection.find({}, {"userId": 1, "talk": 1, "timestamp": 1, "_id" : 0}):
            print("This talk has already been saved")
            return -1

        resp = talksCollection.insert_one(talk)
        talkId = resp.inserted_id
        return talkId

    def userExists(self, userId: str): 
        usersCollection = self.db.users
        userId = ObjectId(userId)
        resp = usersCollection.find_one({ "_id" : userId })

        if resp is None:
            return False
        else:
            return True
    
    def search(self, userId, query, timeRange=86400):
        talksCollection = self.db.talks

        time, query = self.parseQuery(query)
        startTime = time - timeRange
        endTime = time + timeRange
        resp = talksCollection.find({ "timestamp" : { "$gt" : startTime , "$lt": endTime }, "userId" : userId, "$text": {"$search" : query }} )
        
        data = list()
        for item in resp:
            data.append(item)
        
        return data

    def parseQuery(self, query):
        query = query.split(" ", 1)
        timestamp = datetime.strptime(query[0], "%m-%d-%Y")
        timestamp = (timestamp - datetime(1970,1,1)).total_seconds() #convert to Unix time
        return (timestamp, query[1:][0])



def main():
    db = Database()
    db.connect()
    #resp = db.addTalk("5e0e6e1807cdcbd6a097708d", "Hello, how what the fuck is it going?", "11234.223")
    #time, query = db.parseQuery("03-19-2019 what is up man?")
    #print(time, query)
    resp = db.search("5e0e6e1807cdcbd6a097708d", "01-03-2020 cayden")
    for item in resp:
        print(item['talk'])

if __name__ == "__main__":
    main()
