import socket
import json
import requests


talkReq = {
    "userId" : "5e0e6e1807cdcbd6a097708d",
    "type" : "talk",
    "phrases" : [{ "timestamp" : 12344.1232435, "speech" : "this is what the person said"},
                { "timestamp" : 123435.12324399999999, "speech" : "testing yeah testing"}]
    }

phraseReq = {
    "userId" : "5e0e6e1807cdcbd6a097708d",
    "type" : "phrasing",
    "phrases" : [{ "timestamp" : 123439.1232435, "speech" : "put me in coach"}]
    }

searchReq = {
        "userId" : "5e0e6e1807cdcbd6a097708d",
        "query" : "testing"
        }

def search(query):
    resp = requests.post('http://127.0.0.1:5000/search', json=searchReq)
    return resp.json()

def main():
    #sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    #sock.sendto(json.dumps(talkReq).encode('utf-8'), 0, ('127.0.0.1', 5005)) 
    r = search("testing")
    print(r)

if __name__ == "__main__":
    main()
