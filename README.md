# memory-expansion-tools

Visit <https://memoryexpansiontools.com> to sign up and use the tools alongside the Android app.  
Download the app on the Google Play Store: <https://play.google.com/store/apps/details?id=com.memoryexpansiontools.mxt> to capture voice commands and stream memories to the memory dashboard website.

These are tools used to expand your memory.

Expanding one's memory is extending one's thinking. 

The memory-expansion-tools system is designed to be an extension to human memory. You can captures all of your thoughts, ideas, and experiences in a technological extension to your mind. A key feature to the system is the high bandwidth interface, the voice interface. This allows for immediate natural language input and storage in the expanded memory system. All of your memories are immediatly available on the web via the memory dashboard at <https://memoryexpansiontools.com> to access all of the available expanded memory tools.

## How It Works  

The key mental upgrades this app currently provides you are:  

### Memory Stream - Tool for mental offloading 
When you have many ideas and thoughts flowing through your mind, put it all into the cache. This creates a mind like water, allowing you to flow between ideas and tasks without worrying about losing the previous ideas, as you can trust they are being remembered by the system. Important thoughts in the stream can be saved for later viewing using the MXT Cache and Tags, as described below.

### MXT Cache - Tool for mental onloading 
When you are about to do something like work out a problem, go for a walk to think, or write out and explore your ideas, it is time to pullup and review the MXT Cache. This cache review period is when you read quick snippets from the past 24 hours (the contents of the cache) and instantly *onload* mental states that you had been in earlier that day, or late the day before. This allows you to instantly jump back to where you left off in a train of thought, an idea, or a problem.

### Tags

Create custom tags and labels for your memories. Simply say the labels when you are saving to the cache using "MXT" and then view organized tag bins on the web at <https://memoryexpansiontools.com>   
### Search

Search through all of your external memory by text queries.  

#### How to View the Cache

##### Web  

Please visit <https://memoryexpansiontools.com> to sign up and access all tools on the web (desktop/laptop/mobile).  

##### Android

The app is primarily for capturing memories (voice transcriptions) and the Memory Stream is available on the Android app. The other tools will be added to the Android app as well soon.

## How To Use

It is recommended that you use a Blueotooth earpierce/headphones to take full advantage of the high bandwidth voice command interface.  

### Voice Command Interface

There is a single wake word for your expanded memory: MXT.

##### Memory Stream, MXT Cache  

"MXT" - say this to tag anything that you want to put into your MXT cache.  This is anything that comes to your mind that have judged as high quality ideas/thoughts and you would benefit from reviewing in the next 24 hours. This frees your brain from constantly grasping and losing ideas as you become completlty free to flow from idea to idea, knowing you can subsequently reload your thoughts and reload your memory from interfacing with your memory dashboard, the memory expansion tools..  

As you are walking, driving, bussing, exercising, reading, sitting, or waiting in line, you are constantly of thinking of new ideas, rehashing old ideas, extending previous ideas, etc. Whenever ideas come to mind that you think are of any value, you should save them to your cache. Save them to your cache by saying "MXT" followed by whatever it is you want to save to the cache (e.g., I would be walking in the woods and say into my Bluetooth headset: "MXT we need to build robots to clean autonomous vehicle fleets"). Then, whenever you have a chance to sit back and think, you should review your memory cache. A few days of following this routine will show you that you have far more ideas, make more progress, and have more inspiration then you ever thought before  

##### Tags

You can follow the wake sequence command, "MXT", with custom labels that you create, such as "finances", "new ideas", or "wearables". You can then view memory bins that are organized based on the words that you tag in the memories you save. 

## Install   

### Android

Download from the Google Play Store <https://play.google.com/store/apps/details?id=com.memoryexpansiontools.mxt>. Or just open the Android folders (AndroidMXT) in Android Studio, build, and install on your device.

### Server
This has only been run/tested on an Ubuntu 18.04 LTS box.  
#### Apache Setup  

- running on gunicorn, gevent, and nginx
- see deploy folder for info

#### Flask Setup
-install Python3  
-install pip3  
-setup venv and activate virtualenv  
```
pip3 install virtualenv; python3 -m virtualenv venv; source venv/bin/activate
```  
-install required packages into virtualenv:  
```  
pip3 install -r requirements.txt
```  
-need deepspeech v0.8.2 scorer and pbmm models
    - download here: 
        - https://github.com/mozilla/DeepSpeech/releases/download/v0.8.2/deepspeech-0.8.2-models.scorer
        - https://github.com/mozilla/DeepSpeech/releases/download/v0.8.2/deepspeech-0.8.2-models.pbmm
    - put in /web/backend/libs

#### Mongo Setup

-install Mongo and setup to run as a system d service: <https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04>  
##### Setup text indices for search

(this may have to be done after initializing the database with a talk request first)

```
mongo
use sam
db.talks.createIndex( { "talk" : "text" }, { default_language: "none" } )
```

## Authours
Created by Jeremy Stairs and Cayden Pierce
