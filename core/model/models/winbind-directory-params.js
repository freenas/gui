var Montage = require("montage").Montage;

exports.WinbindDirectoryParams = Montage.specialize({
    _allow_dns_updates: {
        value: null
    },
    allow_dns_updates: {
        set: function (value) {
            if (this._allow_dns_updates !== value) {
                this._allow_dns_updates = value;
            }
        },
        get: function () {
            return this._allow_dns_updates;
        }
    },
    _dc_address: {
        value: null
    },
    dc_address: {
        set: function (value) {
            if (this._dc_address !== value) {
                this._dc_address = value;
            }
        },
        get: function () {
            return this._dc_address;
        }
    },
    _gcs_address: {
        value: null
    },
    gcs_address: {
        set: function (value) {
            if (this._gcs_address !== value) {
                this._gcs_address = value;
            }
        },
        get: function () {
            return this._gcs_address;
        }
    },
    _keytab: {
        value: null
    },
    keytab: {
        set: function (value) {
            if (this._keytab !== value) {
                this._keytab = value;
            }
        },
        get: function () {
            return this._keytab;
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
    _site_name: {
        value: null
    },
    site_name: {
        set: function (value) {
            if (this._site_name !== value) {
                this._site_name = value;
            }
        },
        get: function () {
            return this._site_name;
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
            name: "allow_dns_updates",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "dc_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "gcs_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "keytab",
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
            name: "site_name",
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
