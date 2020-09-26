#!/usr/bin/env bash

npm run build && cp ../../deploy/.htaccess ./build && sudo systemctl restart apache2 && echo "Build complete and live."

