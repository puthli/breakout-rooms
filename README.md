# breakout-rooms
Breakout-rooms add-on to to the Jitsi Meet and Jitsi Videobridge projects. Also includes a prometheus endpoint for the videoserver that you can poll to get statistics.

## prerequisites
- Docker
- Docker compose
- Bash

## installation (work in progress)
Copy the example.env file to .env and change the MYPUBLICURL and MYCONTACTEMAIL to your url and contact email. The letsencrypt script will attempt to create an ssh certificate for that url, so it needs to be something in your control.

### bundle the files into a zip file
```
. ./zip.sh
```
Will create two zip files. Copy them to the server you want to install breakout-rooms

### download and install jitsi docker 

```
git clone https://github.com/jitsi/docker-jitsi-meet && cd docker-jitsi-meet

mkdir /config
mkdir -p /config/{web/letsencrypt,transcripts,prosody,jicofo,jvb}
```
To create the folders we need, do 
```
docker-compose up -d
```
Then do
```
docker-compose down
```

### add the breakout-rooms software

```
export CONFIG=/config
mkdir /docker-websocket
unzip /docker-websocket.zip -d /docker-websocket
mkdir /additional-config
unzip /additional-config.zip -d /
cp /additional-config/docker-compose.yml /docker-jitsi-meet/
```
Start all the services using:
```
. /additional-config/scripts/start-all.sh
```