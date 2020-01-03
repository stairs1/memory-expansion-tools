from pymongo import MongoClient
from bson.objectid import ObjectId

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
    
    def search(self, userId, query):
        talksCollection = self.db.talks
        print("searching for {} for {}".format(query, userId))
        resp = talksCollection.find( { "userId" : userId, "$text": { "$search": query } } )
        print(resp)
        data = list()
        for item in resp:
            print(item)
            data.append(item)
        return data


def main():
    db = Database()
    db.connect()
    #resp = db.addTalk("5e0e6e1807cdcbd6a097708d", "Hello, how is it going?", time.time())
    resp = db.search("testing")
    for item in resp:
        print(item['talk'])

if __name__ == "__main__":
    main()
