#
#    Copyright 2020 Itude Mobile BV
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#

#!/bin/bash

# copy config files to volumes for the jitsi-web container
sudo cp /additional-config/site-confs/default /config/web/nginx/site-confs/default
sudo cp /additional-config/nginx/websocket.conf /config/web/nginx/
sudo cp /additional-config/nginx/meet.conf /config/web/nginx/
sudo cp /additional-config/interface_config.js /config/web/
sudo cp /additional-config/config.js /config/web/
sudo cp /additional-config/docker-compose.yml /docker-jitsi-meet/

cd /docker-jitsi-meet
/usr/local/bin/docker-compose up -d

cd /docker-websocket
. ./start.sh

cd /
