var Montage = require("montage").Montage;

exports.ServiceNfs = Montage.specialize({
    _bind_addresses: {
        value: null
    },
    bind_addresses: {
        set: function (value) {
            if (this._bind_addresses !== value) {
                this._bind_addresses = value;
            }
        },
        get: function () {
            return this._bind_addresses;
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
    _mountd_port: {
        value: null
    },
    mountd_port: {
        set: function (value) {
            if (this._mountd_port !== value) {
                this._mountd_port = value;
            }
        },
        get: function () {
            return this._mountd_port;
        }
    },
    _nonroot: {
        value: null
    },
    nonroot: {
        set: function (value) {
            if (this._nonroot !== value) {
                this._nonroot = value;
            }
        },
        get: function () {
            return this._nonroot;
        }
    },
    _rpclockd_port: {
        value: null
    },
    rpclockd_port: {
        set: function (value) {
            if (this._rpclockd_port !== value) {
                this._rpclockd_port = value;
            }
        },
        get: function () {
            return this._rpclockd_port;
        }
    },
    _rpcstatd_port: {
        value: null
    },
    rpcstatd_port: {
        set: function (value) {
            if (this._rpcstatd_port !== value) {
                this._rpcstatd_port = value;
            }
        },
        get: function () {
            return this._rpcstatd_port;
        }
    },
    _servers: {
        value: null
    },
    servers: {
        set: function (value) {
            if (this._servers !== value) {
                this._servers = value;
            }
        },
        get: function () {
            return this._servers;
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
    _udp: {
        value: null
    },
    udp: {
        set: function (value) {
            if (this._udp !== value) {
                this._udp = value;
            }
        },
        get: function () {
            return this._udp;
        }
    },
    _v4: {
        value: null
    },
    v4: {
        set: function (value) {
            if (this._v4 !== value) {
                this._v4 = value;
            }
        },
        get: function () {
            return this._v4;
        }
    },
    _v4_kerberos: {
        value: null
    },
    v4_kerberos: {
        set: function (value) {
            if (this._v4_kerberos !== value) {
                this._v4_kerberos = value;
            }
        },
        get: function () {
            return this._v4_kerberos;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "bind_addresses",
            valueType: "array"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "mountd_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "nonroot",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "rpclockd_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "rpcstatd_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "servers",
            valueType: "number"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "udp",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "v4",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "v4_kerberos",
            valueType: "boolean"
        }]
    }
});
