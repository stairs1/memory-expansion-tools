# SAMdroid

## Mongo Setup

### Install 
https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-18-04
### Setup text indices for search

(this may have to be done after initializing the database with a talk request first)

```
mongo
use main
db.talks.createIndex( { "talk" : "text" } )
```

