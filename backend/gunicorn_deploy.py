#! /usr/bin/python3.6

import logging
import sys
import os

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/var/www/html/mxt/backend')

print("****************** exec is {}".format(sys.executable))

from server import app

if __name__ == "__main__":
    app.run(host='0.0.0.0')
