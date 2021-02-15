# breakout-rooms
Breakout-rooms add-on to to the Jitsi Meet and Jitsi Videobridge projects.

## prerequisites
- Docker
- Docker compose
- Bash

## installation (work in progress)
```
git clone https://github.com/jitsi/docker-jitsi-meet && cd docker-jitsi-meet

mkdir /config
mkdir -p /config/{web/letsencrypt,transcripts,prosody,jicofo,jvb}
```
To create the folders we need, do 
```docker-compose up -d
```
Then do
```docker-compose down
```

```export CONFIG=/config
mkdir /docker-websocket
unzip /docker-websocket.zip -d /docker-websocket
mkdir /additional-config
unzip /additional-config.zip -d /
cp /additional-config/docker-compose.yml /docker-jitsi-meet/
```
Start all the services using:
```. /additional-config/scripts/start-all.sh
```