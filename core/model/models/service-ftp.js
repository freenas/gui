var Montage = require("montage").Montage;

exports.ServiceFtp = Montage.specialize({
    _anon_down_bandwidth: {
        value: null
    },
    anon_down_bandwidth: {
        set: function (value) {
            if (this._anon_down_bandwidth !== value) {
                this._anon_down_bandwidth = value;
            }
        },
        get: function () {
            return this._anon_down_bandwidth;
        }
    },
    _anon_up_bandwidth: {
        value: null
    },
    anon_up_bandwidth: {
        set: function (value) {
            if (this._anon_up_bandwidth !== value) {
                this._anon_up_bandwidth = value;
            }
        },
        get: function () {
            return this._anon_up_bandwidth;
        }
    },
    _anonymous_path: {
        value: null
    },
    anonymous_path: {
        set: function (value) {
            if (this._anonymous_path !== value) {
                this._anonymous_path = value;
            }
        },
        get: function () {
            return this._anonymous_path;
        }
    },
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
    _chroot: {
        value: null
    },
    chroot: {
        set: function (value) {
            if (this._chroot !== value) {
                this._chroot = value;
            }
        },
        get: function () {
            return this._chroot;
        }
    },
    _dirmask: {
        value: null
    },
    dirmask: {
        set: function (value) {
            if (this._dirmask !== value) {
                this._dirmask = value;
            }
        },
        get: function () {
            return this._dirmask;
        }
    },
    _display_login: {
        value: null
    },
    display_login: {
        set: function (value) {
            if (this._display_login !== value) {
                this._display_login = value;
            }
        },
        get: function () {
            return this._display_login;
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
    _filemask: {
        value: null
    },
    filemask: {
        set: function (value) {
            if (this._filemask !== value) {
                this._filemask = value;
            }
        },
        get: function () {
            return this._filemask;
        }
    },
    _fxp: {
        value: null
    },
    fxp: {
        set: function (value) {
            if (this._fxp !== value) {
                this._fxp = value;
            }
        },
        get: function () {
            return this._fxp;
        }
    },
    _ident: {
        value: null
    },
    ident: {
        set: function (value) {
            if (this._ident !== value) {
                this._ident = value;
            }
        },
        get: function () {
            return this._ident;
        }
    },
    _ip_connections: {
        value: null
    },
    ip_connections: {
        set: function (value) {
            if (this._ip_connections !== value) {
                this._ip_connections = value;
            }
        },
        get: function () {
            return this._ip_connections;
        }
    },
    _local_down_bandwidth: {
        value: null
    },
    local_down_bandwidth: {
        set: function (value) {
            if (this._local_down_bandwidth !== value) {
                this._local_down_bandwidth = value;
            }
        },
        get: function () {
            return this._local_down_bandwidth;
        }
    },
    _local_up_bandwidth: {
        value: null
    },
    local_up_bandwidth: {
        set: function (value) {
            if (this._local_up_bandwidth !== value) {
                this._local_up_bandwidth = value;
            }
        },
        get: function () {
            return this._local_up_bandwidth;
        }
    },
    _login_attempt: {
        value: null
    },
    login_attempt: {
        set: function (value) {
            if (this._login_attempt !== value) {
                this._login_attempt = value;
            }
        },
        get: function () {
            return this._login_attempt;
        }
    },
    _masquerade_address: {
        value: null
    },
    masquerade_address: {
        set: function (value) {
            if (this._masquerade_address !== value) {
                this._masquerade_address = value;
            }
        },
        get: function () {
            return this._masquerade_address;
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
    _only_anonymous: {
        value: null
    },
    only_anonymous: {
        set: function (value) {
            if (this._only_anonymous !== value) {
                this._only_anonymous = value;
            }
        },
        get: function () {
            return this._only_anonymous;
        }
    },
    _only_local: {
        value: null
    },
    only_local: {
        set: function (value) {
            if (this._only_local !== value) {
                this._only_local = value;
            }
        },
        get: function () {
            return this._only_local;
        }
    },
    _passive_ports_max: {
        value: null
    },
    passive_ports_max: {
        set: function (value) {
            if (this._passive_ports_max !== value) {
                this._passive_ports_max = value;
            }
        },
        get: function () {
            return this._passive_ports_max;
        }
    },
    _passive_ports_min: {
        value: null
    },
    passive_ports_min: {
        set: function (value) {
            if (this._passive_ports_min !== value) {
                this._passive_ports_min = value;
            }
        },
        get: function () {
            return this._passive_ports_min;
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
    _resume: {
        value: null
    },
    resume: {
        set: function (value) {
            if (this._resume !== value) {
                this._resume = value;
            }
        },
        get: function () {
            return this._resume;
        }
    },
    _reverse_dns: {
        value: null
    },
    reverse_dns: {
        set: function (value) {
            if (this._reverse_dns !== value) {
                this._reverse_dns = value;
            }
        },
        get: function () {
            return this._reverse_dns;
        }
    },
    _root_login: {
        value: null
    },
    root_login: {
        set: function (value) {
            if (this._root_login !== value) {
                this._root_login = value;
            }
        },
        get: function () {
            return this._root_login;
        }
    },
    _timeout: {
        value: null
    },
    timeout: {
        set: function (value) {
            if (this._timeout !== value) {
                this._timeout = value;
            }
        },
        get: function () {
            return this._timeout;
        }
    },
    _tls: {
        value: null
    },
    tls: {
        set: function (value) {
            if (this._tls !== value) {
                this._tls = value;
            }
        },
        get: function () {
            return this._tls;
        }
    },
    _tls_options: {
        value: null
    },
    tls_options: {
        set: function (value) {
            if (this._tls_options !== value) {
                this._tls_options = value;
            }
        },
        get: function () {
            return this._tls_options;
        }
    },
    _tls_policy: {
        value: null
    },
    tls_policy: {
        set: function (value) {
            if (this._tls_policy !== value) {
                this._tls_policy = value;
            }
        },
        get: function () {
            return this._tls_policy;
        }
    },
    _tls_ssl_certificate: {
        value: null
    },
    tls_ssl_certificate: {
        set: function (value) {
            if (this._tls_ssl_certificate !== value) {
                this._tls_ssl_certificate = value;
            }
        },
        get: function () {
            return this._tls_ssl_certificate;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "anon_down_bandwidth",
            valueType: "number"
        }, {
            mandatory: false,
            name: "anon_up_bandwidth",
            valueType: "number"
        }, {
            mandatory: false,
            name: "anonymous_path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "chroot",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "dirmask",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "display_login",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "filemask",
            valueObjectPrototypeName: "UnixPermissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "fxp",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "ident",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "ip_connections",
            valueType: "number"
        }, {
            mandatory: false,
            name: "local_down_bandwidth",
            valueType: "number"
        }, {
            mandatory: false,
            name: "local_up_bandwidth",
            valueType: "number"
        }, {
            mandatory: false,
            name: "login_attempt",
            valueType: "number"
        }, {
            mandatory: false,
            name: "masquerade_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "max_clients",
            valueType: "number"
        }, {
            mandatory: false,
            name: "only_anonymous",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "only_local",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "passive_ports_max",
            valueType: "number"
        }, {
            mandatory: false,
            name: "passive_ports_min",
            valueType: "number"
        }, {
            mandatory: false,
            name: "port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "resume",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "reverse_dns",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "root_login",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "timeout",
            valueType: "number"
        }, {
            mandatory: false,
            name: "tls",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "tls_options",
            valueObjectPrototypeName: "ServiceFtpTlsoptionsItems",
            valueType: "array"
        }, {
            mandatory: false,
            name: "tls_policy",
            valueObjectPrototypeName: "ServiceFtpTlspolicy",
            valueType: "object"
        }, {
            mandatory: false,
            name: "tls_ssl_certificate",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
