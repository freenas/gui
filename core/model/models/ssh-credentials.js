var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.SshCredentials = AbstractModel.specialize({
    _hostkey: {
        value: null
    },
    hostkey: {
        set: function (value) {
            if (this._hostkey !== value) {
                this._hostkey = value;
            }
        },
        get: function () {
            return this._hostkey;
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
    _pubkey: {
        value: null
    },
    pubkey: {
        set: function (value) {
            if (this._pubkey !== value) {
                this._pubkey = value;
            }
        },
        get: function () {
            return this._pubkey;
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
    _username: {
        value: null
    },
    username: {
        set: function (value) {
            if (this._username !== value) {
                this._username = value;
            }
        },
        get: function () {
            return this._username;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "hostkey",
            valueType: "String"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "pubkey",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
