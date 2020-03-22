These are the Apache2 scripts to have running. Put these in /etc/apache2/sites-available and then run

```
sudo a2ensite <name of .conf fil>
sudo systemctl restart apache2
```

this will get the site up and running if everything else is configured correctly.

Note that the backend is running on port 1337 and the Apache is redirecting all /api endpoint requests to the backend.

All port 80/443 requests, Apache serves the React frontend.

See the main README for setup of this, but basically use these conf files to configure Apache to communicate with Flask backend, serve the React frontend.

The sam.wsgi file here is what the backend .conf file is referencing. This is needed to start the Flask server with Apache.

Finally, checkout the build.sh script in ../server/frontend. Run this to build the React frontend changes you make and restart the server stuff so it is immediatly live (assuming all of the Apache stuff is already properly setup).
