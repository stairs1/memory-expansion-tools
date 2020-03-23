-this folder is the backend  
-see ./frontend/ for the React frontend  
-server.py is the main server that starts up Flask and routes endpoints to different flask-restful files  
-flask-restful endpoints make up most of the big list of files ./api/, along with a socket-io handler (PhraseUpdate) that deals with providing live information (memory stream) to the frontend/Android app  
-db.py is the database (mongo) adapter class used in all of the endpoints to communicate with the server  
-./templates/ is web content and mostly (completely?) no longer used after upgrading to React  
-

