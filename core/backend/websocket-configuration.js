var Map = require("collections/map");

var WebSocketConfiguration = exports.WebSocketConfiguration =  function WebSocketConfiguration () {
    this._store = new Map();
};


WebSocketConfiguration.KEYS = {
    SECURE: "SECURE",
    HOST: "HOST",
    PORT: "PORT",
    PATH: "PATH",
    URL: "URL",
    TIMEOUT: "TIMEOUT"
};


WebSocketConfiguration.WEB_SOCKET_PROTOCOLS = {
    SECURE: "wss://",
    UNSECURE: "ws://"
};


WebSocketConfiguration.prototype.set = function (key, value) {
    var keys = WebSocketConfiguration.KEYS;

    if (keys[key] && keys.URL !== key) {
        this._store.set(key, value);
    }
};


WebSocketConfiguration.prototype.get = function (key) {
    var keys = WebSocketConfiguration.KEYS,
        value = null;

    if (keys[key]) {
        var URLKey = keys.URL;

        if (key === URLKey) {
            this._store.set(URLKey, this._makeURL());
        }

        value = this._store.get(key);
    }

    return value;
};


WebSocketConfiguration.prototype._makeURL = function () {
    var store = this._store,
        keys = WebSocketConfiguration.KEYS,
        protocols = WebSocketConfiguration.WEB_SOCKET_PROTOCOLS,
        protocol = store.get(keys.SECURE) ? protocols.SECURE : protocols.UNSECURE,
        host = store.get(keys.HOST) || "127.0.0.1",
        port = store.get(keys.PORT),
        path = store.get(keys.PATH);

    return protocol + host + (port ? ":" + port : '') + (path ? path : '');
};


var _defaultConfiguration = null,
    _shellConfiguration = null;
Object.defineProperties(WebSocketConfiguration, {
    defaultConfiguration: {
        get: function () {
            if (!_defaultConfiguration) {
                _defaultConfiguration = new WebSocketConfiguration();

                var domain = document.domain;

                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.SECURE, window.location.protocol === "https:");
                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.PORT, "5000");
                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.PATH, "/socket");
                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.TIMEOUT, 30000);

                _defaultConfiguration._store.set(
                    WebSocketConfiguration.KEYS.HOST,
                    (domain === "localhost" || domain === "127.0.0.1") ? "freenas.local" : domain
                );
            }

            return _defaultConfiguration;
        }
    },

    shellConfiguration: {
        get: function () {
            if (!_shellConfiguration) {
                _shellConfiguration = new WebSocketConfiguration();

                var domain = document.domain;

                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.SECURE, window.location.protocol === "https:");
                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.PORT, "5000");
                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.PATH, "/shell");
                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.TIMEOUT, 30000);

                _shellConfiguration._store.set(
                    WebSocketConfiguration.KEYS.HOST,
                    (domain === "localhost" || domain === "127.0.0.1") ? "freenas.local" : domain
                );
            }

            return _shellConfiguration;
        }
    }
});
