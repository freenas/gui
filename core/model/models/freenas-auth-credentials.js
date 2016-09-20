var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.FreenasAuthCredentials = AbstractModel.specialize({
    _address: {
        value: null
    },
    address: {
        set: function (value) {
            if (this._address !== value) {
                this._address = value;
            }
        },
        get: function () {
            return this._address;
        }
    },
    _auth_code: {
        value: null
    },
    auth_code: {
        set: function (value) {
            if (this._auth_code !== value) {
                this._auth_code = value;
            }
        },
        get: function () {
            return this._auth_code;
        }
    },
    _key_auth: {
        value: null
    },
    key_auth: {
        set: function (value) {
            if (this._key_auth !== value) {
                this._key_auth = value;
            }
        },
        get: function () {
            return this._key_auth;
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
            name: "address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "auth_code",
            valueType: "number"
        }, {
            mandatory: false,
            name: "key_auth",
            valueType: "boolean"
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
            name: "type"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
