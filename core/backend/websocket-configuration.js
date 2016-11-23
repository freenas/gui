var Map = require("collections/map");

var WebSocketConfiguration = exports.WebSocketConfiguration =  function WebSocketConfiguration () {
    this._store = new Map();
};

WebSocketConfiguration.SERVER_HOST = "freenas.local"

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

    return protocol + this._getHost() + (path ? path : '');
};

WebSocketConfiguration.prototype._getHost = function() {
    var domain = document.domain,
        result = ((domain === "localhost" || domain === "127.0.0.1") ? WebSocketConfiguration.SERVER_HOST : domain) + ':' + this._getPort(),
        hostParam = window.location.href.split(';').filter(function(x) {
            return x.split('=')[0] === "host";
        })[0];

    if (hostParam) {
        var host = hostParam.split('=')[1];
        if (host && host.length > 0) {
            result = host;
        }
    }
    return result;
};

WebSocketConfiguration.prototype._getPort = function() {
    return window.location.port || (window.location.protocol === "https:" ? "443" : "80");
};

var _defaultConfiguration = null,
    _shellConfiguration = null,
    _fileUploadConfiguration,
    _consoleConfiguration;
Object.defineProperties(WebSocketConfiguration, {
    defaultConfiguration: {
        get: function () {
            if (!_defaultConfiguration) {
                _defaultConfiguration = new WebSocketConfiguration();

                var domain = document.domain;

                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.SECURE, window.location.protocol === "https:");
                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.PORT, _defaultConfiguration._getPort());
                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.PATH, "/dispatcher/socket");
                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.TIMEOUT, 60000);

                _defaultConfiguration._store.set(WebSocketConfiguration.KEYS.HOST, _defaultConfiguration._getHost());
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
                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.PORT, _shellConfiguration._getPort());
                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.PATH, "/dispatcher/shell");
                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.TIMEOUT, 30000);

                _shellConfiguration._store.set(WebSocketConfiguration.KEYS.HOST, _shellConfiguration._getHost());
            }

            return _shellConfiguration;
        }
    },

    fileUploadConfiguration: {
        get: function () {
            if (!_fileUploadConfiguration) {
                _fileUploadConfiguration = new WebSocketConfiguration();

                var domain = document.domain;

                _fileUploadConfiguration._store.set(WebSocketConfiguration.KEYS.SECURE, window.location.protocol === "https:");
                _fileUploadConfiguration._store.set(WebSocketConfiguration.KEYS.PORT, _fileUploadConfiguration._getPort());
                _fileUploadConfiguration._store.set(WebSocketConfiguration.KEYS.PATH, "/dispatcher/file");
                _fileUploadConfiguration._store.set(WebSocketConfiguration.KEYS.TIMEOUT, 30000);

                _fileUploadConfiguration._store.set(WebSocketConfiguration.KEYS.HOST, _fileUploadConfiguration._getHost());
            }

            return _fileUploadConfiguration;
        }
    },

    consoleConfiguration: {
        get: function () {
            if (!_consoleConfiguration) {
                _consoleConfiguration = new WebSocketConfiguration();

                var domain = document.domain;

                _consoleConfiguration._store.set(WebSocketConfiguration.KEYS.SECURE, window.location.protocol === "https:");
                _consoleConfiguration._store.set(WebSocketConfiguration.KEYS.PORT, _consoleConfiguration._getPort());
                _consoleConfiguration._store.set(WebSocketConfiguration.KEYS.PATH, "/containerd/console");
                _consoleConfiguration._store.set(WebSocketConfiguration.KEYS.TIMEOUT, 30000);

                _consoleConfiguration._store.set(WebSocketConfiguration.KEYS.HOST, _consoleConfiguration._getHost());
            }

            return _consoleConfiguration;
        }
    }
});
