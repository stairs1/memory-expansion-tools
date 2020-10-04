# Overview

Backend is running on a local unix socket using gunicorn, running as a system service (see .service file here). We are using eventlet because it works well with Flask-Socketio, which gives problems on many systems (including Apache2, which is why we switched to this setup).

Nginx is serving the front end and proxying requests to the gunicorn server.
Built frontend is at /frontend/build.
Backend is at /backend/server.py, and the gunicorn deploy file is also in /backend.

## Quick Setup

Use the .conf filed given here, add them to Nginx, add the mxt_gunicorn.service file to /etc/systemd/system and start the systemd service with `sudo systemctl start mxt_gunicorn && sudo systemctl enable mxt_gunicorn`

