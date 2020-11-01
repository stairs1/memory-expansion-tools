#!/usr/bin/env bash

npm run build && sudo systemctl restart mxt_gunicorn && sudo systemctl restart nginx && echo "Build complete and live."

