var WebSocketConfiguration = exports.WebSocketConfiguration = {

    WEB_SOCKET_PROTOCOL: null,

    WEB_SOCKET_HOST: null,

    WEB_SOCKET_PORT: null,

    WEB_SOCKET_PATH: null,

    WEB_SOCKET_URL: null,

    WEB_SOCKET_SEND_MESSAGE_TIMEOUT: 15000 // -> ms

};

function _init () {
    var domain = document.domain;

    WebSocketConfiguration.WEB_SOCKET_PROTOCOL = (window.location.protocol === "https:") ? "wss://" : "ws://";
    //FIXME: switch just to document.domain for production
    WebSocketConfiguration.WEB_SOCKET_HOST = domain === "localhost" || domain === "127.0.0.1" ? "192.168.228.132" : document.domain;
    WebSocketConfiguration.WEB_SOCKET_PORT = "5000";
    WebSocketConfiguration.WEB_SOCKET_PATH = "/socket";
    WebSocketConfiguration.WEB_SOCKET_URL = WebSocketConfiguration.WEB_SOCKET_PROTOCOL +
        WebSocketConfiguration.WEB_SOCKET_HOST + ":" + WebSocketConfiguration.WEB_SOCKET_PORT +
        WebSocketConfiguration.WEB_SOCKET_PATH;
}

_init();
