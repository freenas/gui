var Montage = require("montage").Montage;

exports.ServiceOpenvpn = Montage.specialize({
    _auxiliary: {
        value: null
    },
    auxiliary: {
        set: function (value) {
            if (this._auxiliary !== value) {
                this._auxiliary = value;
            }
        },
        get: function () {
            return this._auxiliary;
        }
    },
    _ca: {
        value: null
    },
    ca: {
        set: function (value) {
            if (this._ca !== value) {
                this._ca = value;
            }
        },
        get: function () {
            return this._ca;
        }
    },
    _cert: {
        value: null
    },
    cert: {
        set: function (value) {
            if (this._cert !== value) {
                this._cert = value;
            }
        },
        get: function () {
            return this._cert;
        }
    },
    _cipher: {
        value: null
    },
    cipher: {
        set: function (value) {
            if (this._cipher !== value) {
                this._cipher = value;
            }
        },
        get: function () {
            return this._cipher;
        }
    },
    _comp_lzo: {
        value: null
    },
    comp_lzo: {
        set: function (value) {
            if (this._comp_lzo !== value) {
                this._comp_lzo = value;
            }
        },
        get: function () {
            return this._comp_lzo;
        }
    },
    _crl_verify: {
        value: null
    },
    crl_verify: {
        set: function (value) {
            if (this._crl_verify !== value) {
                this._crl_verify = value;
            }
        },
        get: function () {
            return this._crl_verify;
        }
    },
    _dev: {
        value: null
    },
    dev: {
        set: function (value) {
            if (this._dev !== value) {
                this._dev = value;
            }
        },
        get: function () {
            return this._dev;
        }
    },
    _dh: {
        value: null
    },
    dh: {
        set: function (value) {
            if (this._dh !== value) {
                this._dh = value;
            }
        },
        get: function () {
            return this._dh;
        }
    },
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
        }
    },
    _group: {
        value: null
    },
    group: {
        set: function (value) {
            if (this._group !== value) {
                this._group = value;
            }
        },
        get: function () {
            return this._group;
        }
    },
    _keepalive_peer_down: {
        value: null
    },
    keepalive_peer_down: {
        set: function (value) {
            if (this._keepalive_peer_down !== value) {
                this._keepalive_peer_down = value;
            }
        },
        get: function () {
            return this._keepalive_peer_down;
        }
    },
    _keepalive_ping_interval: {
        value: null
    },
    keepalive_ping_interval: {
        set: function (value) {
            if (this._keepalive_ping_interval !== value) {
                this._keepalive_ping_interval = value;
            }
        },
        get: function () {
            return this._keepalive_ping_interval;
        }
    },
    _key: {
        value: null
    },
    key: {
        set: function (value) {
            if (this._key !== value) {
                this._key = value;
            }
        },
        get: function () {
            return this._key;
        }
    },
    _max_clients: {
        value: null
    },
    max_clients: {
        set: function (value) {
            if (this._max_clients !== value) {
                this._max_clients = value;
            }
        },
        get: function () {
            return this._max_clients;
        }
    },
    _mode: {
        value: null
    },
    mode: {
        set: function (value) {
            if (this._mode !== value) {
                this._mode = value;
            }
        },
        get: function () {
            return this._mode;
        }
    },
    _persist_key: {
        value: null
    },
    persist_key: {
        set: function (value) {
            if (this._persist_key !== value) {
                this._persist_key = value;
            }
        },
        get: function () {
            return this._persist_key;
        }
    },
    _persist_tun: {
        value: null
    },
    persist_tun: {
        set: function (value) {
            if (this._persist_tun !== value) {
                this._persist_tun = value;
            }
        },
        get: function () {
            return this._persist_tun;
        }
    },
    _port: {
        value: null
    },
    port: {
        set: function (value) {
            if (this._port !== value) {
                this._port = value;
            }
        },
        get: function () {
            return this._port;
        }
    },
    _proto: {
        value: null
    },
    proto: {
        set: function (value) {
            if (this._proto !== value) {
                this._proto = value;
            }
        },
        get: function () {
            return this._proto;
        }
    },
    _psk_remote_ip: {
        value: null
    },
    psk_remote_ip: {
        set: function (value) {
            if (this._psk_remote_ip !== value) {
                this._psk_remote_ip = value;
            }
        },
        get: function () {
            return this._psk_remote_ip;
        }
    },
    _psk_server_ip: {
        value: null
    },
    psk_server_ip: {
        set: function (value) {
            if (this._psk_server_ip !== value) {
                this._psk_server_ip = value;
            }
        },
        get: function () {
            return this._psk_server_ip;
        }
    },
    _server_bridge: {
        value: null
    },
    server_bridge: {
        set: function (value) {
            if (this._server_bridge !== value) {
                this._server_bridge = value;
            }
        },
        get: function () {
            return this._server_bridge;
        }
    },
    _server_bridge_extended: {
        value: null
    },
    server_bridge_extended: {
        set: function (value) {
            if (this._server_bridge_extended !== value) {
                this._server_bridge_extended = value;
            }
        },
        get: function () {
            return this._server_bridge_extended;
        }
    },
    _server_bridge_ip: {
        value: null
    },
    server_bridge_ip: {
        set: function (value) {
            if (this._server_bridge_ip !== value) {
                this._server_bridge_ip = value;
            }
        },
        get: function () {
            return this._server_bridge_ip;
        }
    },
    _server_bridge_netmask: {
        value: null
    },
    server_bridge_netmask: {
        set: function (value) {
            if (this._server_bridge_netmask !== value) {
                this._server_bridge_netmask = value;
            }
        },
        get: function () {
            return this._server_bridge_netmask;
        }
    },
    _server_bridge_range_begin: {
        value: null
    },
    server_bridge_range_begin: {
        set: function (value) {
            if (this._server_bridge_range_begin !== value) {
                this._server_bridge_range_begin = value;
            }
        },
        get: function () {
            return this._server_bridge_range_begin;
        }
    },
    _server_bridge_range_end: {
        value: null
    },
    server_bridge_range_end: {
        set: function (value) {
            if (this._server_bridge_range_end !== value) {
                this._server_bridge_range_end = value;
            }
        },
        get: function () {
            return this._server_bridge_range_end;
        }
    },
    _tls_auth: {
        value: null
    },
    tls_auth: {
        set: function (value) {
            if (this._tls_auth !== value) {
                this._tls_auth = value;
            }
        },
        get: function () {
            return this._tls_auth;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    },
    _user: {
        value: null
    },
    user: {
        set: function (value) {
            if (this._user !== value) {
                this._user = value;
            }
        },
        get: function () {
            return this._user;
        }
    },
    _verb: {
        value: null
    },
    verb: {
        set: function (value) {
            if (this._verb !== value) {
                this._verb = value;
            }
        },
        get: function () {
            return this._verb;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "ca",
            valueType: "String"
        }, {
            mandatory: false,
            name: "cert",
            valueType: "String"
        }, {
            mandatory: false,
            name: "cipher",
            valueType: "String"
        }, {
            mandatory: false,
            name: "comp_lzo",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "crl_verify",
            valueType: "String"
        }, {
            mandatory: false,
            name: "dev",
            valueType: "String"
        }, {
            mandatory: false,
            name: "dh",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "group",
            valueType: "String"
        }, {
            mandatory: false,
            name: "keepalive_peer_down",
            valueType: "number"
        }, {
            mandatory: false,
            name: "keepalive_ping_interval",
            valueType: "number"
        }, {
            mandatory: false,
            name: "key",
            valueType: "String"
        }, {
            mandatory: false,
            name: "max_clients",
            valueType: "number"
        }, {
            mandatory: false,
            name: "mode",
            valueType: "String"
        }, {
            mandatory: false,
            name: "persist_key",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "persist_tun",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "proto",
            valueType: "String"
        }, {
            mandatory: false,
            name: "psk_remote_ip",
            valueType: "String"
        }, {
            mandatory: false,
            name: "psk_server_ip",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server_bridge",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "server_bridge_extended",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "server_bridge_ip",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server_bridge_netmask",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server_bridge_range_begin",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server_bridge_range_end",
            valueType: "String"
        }, {
            mandatory: false,
            name: "tls_auth",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "verb",
            valueType: "number"
        }]
    }
});
