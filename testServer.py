import socket
import json


talkReq = {
    "userId" : "5e0e6e1807cdcbd6a097708d",
    "type" : "talk",
    "phrases" : [{ "timestamp" : 123436.1232435, "speech" : "this is what the person said"},
                { "timestamp" : 123437.12324399999999, "speech" : "testing yeah testing"}]
    }

phraseReq = {
    "userId" : "5e0e6e1807cdcbd6a097708d",
    "type" : "phrasing",
    "phrases" : [{ "timestamp" : 123439.1232435, "speech" : "put me in coach"}]
    }

def main():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(json.dumps(phraseReq).encode('utf-8'), 0, ('127.0.0.1', 5005)) 

if __name__ == "__main__":
    main()
