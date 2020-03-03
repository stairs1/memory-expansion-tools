# memory-prosthetic-tools

## Mongo Setup

### Install 
https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04
### Setup text indices for search

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

