#!/bin/bash

zip -r deploy/docker-websocket.zip server.js package-lock.json package.json start.sh create.sh public
zip -r deploy/additional-config.zip additional-config
