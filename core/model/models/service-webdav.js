var Montage = require("montage").Montage;

exports.ServiceWebdav = Montage.specialize({
    _authentication: {
        value: null
    },
    authentication: {
        set: function (value) {
            if (this._authentication !== value) {
                this._authentication = value;
            }
        },
        get: function () {
            return this._authentication;
        }
    },
    _certificate: {
        value: null
    },
    certificate: {
        set: function (value) {
            if (this._certificate !== value) {
                this._certificate = value;
            }
        },
        get: function () {
            return this._certificate;
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
    _http_port: {
        value: null
    },
    http_port: {
        set: function (value) {
            if (this._http_port !== value) {
                this._http_port = value;
            }
        },
        get: function () {
            return this._http_port;
        }
    },
    _https_port: {
        value: null
    },
    https_port: {
        set: function (value) {
            if (this._https_port !== value) {
                this._https_port = value;
            }
        },
        get: function () {
            return this._https_port;
        }
    },
    _password: {
        value: null
    },
    password: {
        set: function (value) {
            if (this._password !== value) {
                this._password = value;
            }
        },
        get: function () {
            return this._password;
        }
    },
    _protocol: {
        value: null
    },
    protocol: {
        set: function (value) {
            if (this._protocol !== value) {
                this._protocol = value;
            }
        },
        get: function () {
            return this._protocol;
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
            name: "authentication",
            valueObjectPrototypeName: "ServiceWebdavAuthentication",
            valueType: "object"
        }, {
            mandatory: false,
            name: "certificate",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "http_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "https_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "protocol",
            valueType: "array"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
