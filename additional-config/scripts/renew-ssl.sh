#!/bin/bash

echo "Make sure the docker-jitsi-meet_web_1 container is running before running this script."

docker exec docker-jitsi-meet_web_1 /defaults/letsencrypt-renew

