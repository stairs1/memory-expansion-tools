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
    
    def nameToId(self, username):
        usersCollection = self.db.users
        _id = usersCollection.find_one( { "username" : username } )
        if not _id:
            return False
        return _id['_id']

    def getPass(self, username):
        userId = self.nameToId(username)

        if not userId:
            return None

        if not self.userExists(userId):
            return None
        else:
            usersCollection = self.db.users
            apass = usersCollection.find_one( { "_id" : ObjectId(userId) } )['password']
            return apass

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

    def talkExists(self, talkId: str): 
        talksCollection = self.db.talks
        talkId = ObjectId(talkId)
        resp = talksCollection.find_one({ "_id" : talkId })

        if resp is None:
            return False
        else:
            return True
    
    def userExists(self, userId: str): 
        usersCollection = self.db.users
        try:
            resp = usersCollection.find_one({ "_id" : ObjectId(userId) })
        except Exception as e: #almost certainly means the userid is not a valid "ObjectId" bson type
            return False

        if resp is None:
            return False
        else:
            return True
    
    def search(self, userId, query, queryTime=None, timeRange=86400):
        talksCollection = self.db.talks

        if queryTime is None:
            startTime = 0
            endTime = time.time() #we can't have memories from the future... yet
        else:    
            startTime = queryTime - timeRange
            endTime = queryTime + timeRange

        resp = talksCollection.find({ "timestamp" : { "$gt" : startTime , "$lt": endTime }, "userId" : userId, "$text": {"$search" : query }} )
        
        data = list()
        for item in resp:
            data.append(item)
        return data

    def getMostRecent(self, userId):
        talksCollection = self.db.talks

        resp = talksCollection.aggregate( [ {"$match" : { "userId" : userId }}, { "$sort" : { "timestamp" : -1 } }, { "$limit" : 1 } ] )
        resp = talksCollection.find({ "userId" : userId }).sort( [ ("timestamp", -1) ]) #.limit(1)

        for item in resp: #little weird b/c resp is a pymongo-cursor
            return item

    def timeFlow(self, userId, talkId=None, timeFrame=None):
        talksCollection = self.db.talks
        
        if not self.userExists(userId):
            return None, None
        if talkId is None: #if no talkId is give, use the most recent talk
            mostRecent = self.getMostRecent(userId)
            talkId = str(mostRecent['_id'])
            reqTime = mostRecent['timestamp']
        elif not self.talkExists(talkId): #if talkId is given, only proceed if it actually exists in database
            return None, None
        else: #if talksId is given to us AND it exists, get its time
            reqTime = talksCollection.find_one( { "_id" : ObjectId(talkId) }, { "timestamp" : 1, "_id" : 0 })['timestamp']

        if timeFrame is None or timeFrame == -1:
            timeFrame = 30

        startTime = reqTime - timeFrame
        endTime = reqTime + timeFrame
        
        resp = talksCollection.find({ "timestamp" : { "$gt" : startTime , "$lt": endTime }, "userId" : userId } ).sort( [("timestamp", 1)] )
        
        data = list()
        for item in resp:
            data.append(item)
        
        return data, talkId

        

def main():
    db = Database()
#    resp = db.addTalk("5e0e6e1807cdcbd6a097708d", "Hello, how is it going?", time.time())
    db.connect()
    #resp = db.search("5e0e6e1807cdcbd6a097708d", "jeremy", time.time()-100)
    #resp = db.timeFlow("5e0e6e1807cdcbd6a097708d", time.time(), 10000000)
    resp = db.timeFlow("5e0e6e1807cdcbd6a097708d")
    for item in resp:
        print(resp)

if __name__ == "__main__":
    main()
