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
    
    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    function isCompatibleBrowser (){
        // based on Duck Typing

        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        let isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]" 
        let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

        // Internet Explorer 6-11
        let isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        let isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1+
        let isChrome = !!window.chrome;

        if (isChrome || isEdge || isFirefox){
            console.log('Supported browser detected');
            return true;
        }
        else{
            $("#incompatibleBrowser").modal("show");
            return false;
        }
    }

    // set up locations of scripts and servers    
    let wsUri = 'wss://'+window.location.host+'/ws/';
    let jitsiDomain = window.location.host;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = '/external_api.js';
    if (window.location.protocol == 'file:') {
        // for local testing
        wsUri = 'wss://dev.wurk.app/ws/';
        jitsiDomain = 'dev.wurk.app';
        script.src  = 'https://dev.wurk.app/external_api.js';
    }
    head.appendChild(script);

    function pad(num, padlen, padchar) {
        var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
        var pad = new Array(1 + padlen).join(pad_char);
        return (pad + num).slice(-pad.length);
    }

    function getRemainingTime() {
        let duration = (timeboxEnd - new Date());
        var diffHrs = pad(Math.floor((duration % 86400000) / 3600000), 2); // hours
        var diffMins = pad(Math.floor(((duration % 86400000) % 3600000) / 60000), 2);
        var diffSecs = pad(Math.floor(((duration % 86400000) % 60000) / 1000), 2);
        return `${diffHrs}:${diffMins}:${diffSecs}`
    }

    function linkify(text) {
    let urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        return "<a target='_blank' href='" + url + "'>" + url + "</a>";
    });
}
    var output;
    let websocket;
    function init() {
        websocket = new WebSocket(wsUri);
        websocket.onopen = function (evt) { onOpen(evt) };
        websocket.onclose = function (evt) { onClose(evt) };
        websocket.onmessage = function (evt) { onMessage(evt) };
        websocket.onerror = function (evt) { onError(evt) };
        websocket.onping = function(evt) { heartbeat() };
        output = document.getElementById("log");
        if (window.location.protocol != 'file:'){
            output.style.display="none";
        }
    }
    function onClose(evt) {
        clearTimeout(this.pingTimeout);
        writeToScreen("DISCONNECTED");
    }
    function heartbeat() {
        clearTimeout(this.pingTimeout);
        // Delay is be equal to the interval at which server
        // sends out pings plus a conservative assumption of the latency.
        this.pingTimeout = setTimeout(() => {
            this.terminate();
        }, 30000 + 1000);
    }
    function onError(evt) {
        writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
    }
    function doSend(message) {
        writeToScreen("SENT: " + message);
        websocket.send(message);
    }
    function writeToScreen(message) {
        var pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        output.appendChild(pre);
        console.log(message);
    }
    window.addEventListener("load", init, false);
