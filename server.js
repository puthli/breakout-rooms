/* 
   Copyright 2020 Itude Mobile BV

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
const request = require('request');
const WebSocket = require('ws');
let express = require('express')
let app = express();
let expressWs = require('express-ws')(app);
let path = require('path');


// Serve static files if no route matches
app.use(express.static(path.join(__dirname, 'public')));

/**************** Websocket ***************/

function noop() { }

function heartbeat() {
    console.log("Heartbeat received");
    this.isAlive = true;
}

var wss = expressWs.getWss();
wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            console.log("Terminated websocket client");
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

const fs = require('fs');

app.get('/prometheus-stats', async function (req, res){
    let url = "http://docker-jitsi-meet_jvb_1:8080/colibri/stats";
    let options = {json: true};

    request(url, options, (error, queryResponse, body) => {
        if (error) {
            res.error("Stats not available");
            return  console.log(error)
        };

        if (!error && queryResponse.statusCode == 200) {
            let json = (body);
            // enumerate keys and values
            let output = "";
            for (var key of Object.keys(json)) {
                if ("version" == key || "current_timestamp" == key 
                || "graceful_shutdown" == key
                || Array.isArray(json[key])){
                    //for now, ignore arrays
                }
                else{
                    output = output + "jitsi_stats_" + key + "  " + json[key] + "\n";
                    console.log(key + "  " + json[key])
                }
            }
            res.send(output);
        };
    });

    // http get localhost:8080/colibri/stats
    // parse json to text
});

app.ws('/', function (ws, req) {
    ws.on('message', function (msg) {
        console.log("Dashboard: websocket received ", msg);
        //ws.send(msg); //echo back
        try {
            if (msg.startsWith("SUB:")){
                var path = msg.substring(4);
                ws.path = path;
                console.log('Subscribed to :' + path)
            }
            else if (msg.startsWith("PUB:")){
                var path = msg.substring(4);
                expressWs.getWss().clients.forEach(function each(client) {
                    if (path.startsWith(client.path) && client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(msg);
                    }
                });
            }
            else {
                console.log("Unrecognized message format, terminating websocket");
                ws.terminate();
            }
        } catch (error) {
            console.log(error);
            console.log("Most likely an attempt to breach security, terminating websocket");
            ws.terminate();
        }
    });
});


/**************** Start the server ****************/

app.listen(8888, () => {
    console.log('Okku Dashboard listening on port 8888!')
});

module.exports = app