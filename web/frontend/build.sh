#!/usr/bin/env bash

npm run build && cp /var/www/html/sam/SAMdroid/deploy/.htaccess /var/www/html/sam/SAMdroid/web/frontend/build && sudo systemctl restart apache2 && echo "Build complete and live."

