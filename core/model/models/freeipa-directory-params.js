var Montage = require("montage").Montage;

exports.FreeipaDirectoryParams = Montage.specialize({
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
    _encryption: {
        value: null
    },
    encryption: {
        set: function (value) {
            if (this._encryption !== value) {
                this._encryption = value;
            }
        },
        get: function () {
            return this._encryption;
        }
    },
    _group_suffix: {
        value: null
    },
    group_suffix: {
        set: function (value) {
            if (this._group_suffix !== value) {
                this._group_suffix = value;
            }
        },
        get: function () {
            return this._group_suffix;
        }
    },
    _kdc: {
        value: null
    },
    kdc: {
        set: function (value) {
            if (this._kdc !== value) {
                this._kdc = value;
            }
        },
        get: function () {
            return this._kdc;
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
    _realm: {
        value: null
    },
    realm: {
        set: function (value) {
            if (this._realm !== value) {
                this._realm = value;
            }
        },
        get: function () {
            return this._realm;
        }
    },
    _server: {
        value: null
    },
    server: {
        set: function (value) {
            if (this._server !== value) {
                this._server = value;
            }
        },
        get: function () {
            return this._server;
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
    _user_suffix: {
        value: null
    },
    user_suffix: {
        set: function (value) {
            if (this._user_suffix !== value) {
                this._user_suffix = value;
            }
        },
        get: function () {
            return this._user_suffix;
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
            name: "certificate",
            valueType: "String"
        }, {
            mandatory: false,
            name: "encryption",
            valueType: "String"
        }, {
            mandatory: false,
            name: "group_suffix",
            valueType: "String"
        }, {
            mandatory: false,
            name: "kdc",
            valueType: "String"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "realm",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "user_suffix",
            valueType: "String"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
