var Montage = require("montage").Montage;

exports.FreenasInitialCredentials = Montage.specialize({
    "_%type": {
        value: null
    },
    "%type": {
        set: function (value) {
            if (this["_%type"] !== value) {
                this["_%type"] = value;
            }
        },
        get: function () {
            return this["_%type"];
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
            name: "%type"
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
            name: "username",
            valueType: "String"
        }]
    }
});
