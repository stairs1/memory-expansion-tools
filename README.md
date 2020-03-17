# memory-expansion-tools

Visit memoryexpansiontools.com to sign up.

These are tools used to expand your memory.

Expanding one's memory is extending one's thinking. If we are able to capture all of someone's thoughts, ideas, and experiences, we give them the ability to think with in an entirely new way, a way that takes into consideration an *extended* amount of ideas and information.

The system adds a new memory feature to the human mind, a mid-term memory, that lasts a single day. The mid-term memory is represented as an external cache. Ideas, thoughts, and inspirations can immeditatly be put into this cache by the user, using a simple voice command (see "How To Use" below").

## How It Works  

The key mental upgrades this app currently provides you are:  

### Memory Stream - Tool for mental offloading 
When you have many ideas and thoughts flowing through your mind, put it all into the cache. This creates a mind like water, allowing you to flow between ideas and tasks without worrying about losing the previous ideas, as you can trust they are being saved into the cache by the system  

### MXT Cache - Tool for mental onloading 
When you are about to sit down to do something like work out a problem, go for a walk to think, or write out and explore your ideas, it is time to pullup and review the MXT Cache. This cache review period is when you read quick snippets from the past 24 hours (the contents of the cache) and instantly *onloading* mental states that you had been in earlier that day, or late the day before. This allows you to instantly jump back to where you left off in a train of thought, an idea, or a problem.

#### How to View the Cache

##### Web  

Please visit memoryexpansiontools.com to sign up and access tools on the web (desktop/laptop/mobile).  

##### Android

Memory Stream is available on the Android app and MXT Cache is coming soon to the Android app as well.

## How To Use

It is recommended that you use a Blueotooth earpierce/headphones to take full advantage of the high bandwidth voice command interface.  

### Voice Command Interface

There is a single wake word for your expanded memory: MXT.

"MXT" - say this to tag anything that you want to put into your MXT cache. This is anything that comes to your mind that have judged as high quality ideas/thoughts and you would benefit from reviewing in the next 24 hours. This frees your brain from constantly grasping and losing ideas as you become completlty free to flow from idea to idea, knowing you can subsequently reload your thoughts and review the a sequential progression of your working train of throught's.

As you are walking, driving, bussing, exercising, reading, sitting, or waiting in line, you are constantly of thinking of new ideas, rehashing old ideas, extending previous ideas, etc. Whenever ideas come to mind that you think are of any value, you should save them to your cache. Save them to your cache by saying "MXT" followed by whatever it is you want to save to the cache (e.g., I would be walking in the woods and say into my Bluetooth headset: "MXT we need to build robots to clean autonomous vehicle fleets"). Then, whenever you have a chance to sit back and think, you should review your memory cache. A few days of following this routine will show you that you have far more ideas, make more progress, and have more inspiration then you ever thought before

## Install   

### Android

Download from the Google Play Store (launching by March 16th). Or just open the Android folders (JetpackSAM or SAMdroid) in Android Studio and build.

### Server
This has only been run/tested on an Ubuntu 18.04 LTS box.
#### Apache Setup  

-Install and configure apache2  
-Setup SSL with certbot - https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04  
-create a new virtualhost for same using something like the sam-apache.conf in the /server directory. Point to the WSGI file given here in the root / as sam.wsgi  
-enable the site with `a2ensite <name>`  
-restart apache with `sudo systemctl restart apache2`  

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

#### Mongo Setup

-install Mongo and setup to run as a system d service: https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04
##### Setup text indices for search

(this may have to be done after initializing the database with a talk request first)

```
mongo
use sam
db.talks.createIndex( { "talk" : "text" }, { default_language: "none" } )
```

If you created the old bad index, remove it first:
```
db.talks.dropIndex( "talk_text" )
```  

### Authours
Created by Jeremy Stairs and Cayden Pierce
