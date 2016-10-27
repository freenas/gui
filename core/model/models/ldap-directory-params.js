var Montage = require("montage").Montage;

exports.LdapDirectoryParams = Montage.specialize({
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
    _base_dn: {
        value: null
    },
    base_dn: {
        set: function (value) {
            if (this._base_dn !== value) {
                this._base_dn = value;
            }
        },
        get: function () {
            return this._base_dn;
        }
    },
    _bind_dn: {
        value: null
    },
    bind_dn: {
        set: function (value) {
            if (this._bind_dn !== value) {
                this._bind_dn = value;
            }
        },
        get: function () {
            return this._bind_dn;
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
    _krb_principal: {
        value: null
    },
    krb_principal: {
        set: function (value) {
            if (this._krb_principal !== value) {
                this._krb_principal = value;
            }
        },
        get: function () {
            return this._krb_principal;
        }
    },
    _krb_realm: {
        value: null
    },
    krb_realm: {
        set: function (value) {
            if (this._krb_realm !== value) {
                this._krb_realm = value;
            }
        },
        get: function () {
            return this._krb_realm;
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
    _verify_certificate: {
        value: null
    },
    verify_certificate: {
        set: function (value) {
            if (this._verify_certificate !== value) {
                this._verify_certificate = value;
            }
        },
        get: function () {
            return this._verify_certificate;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "base_dn",
            valueType: "String"
        }, {
            mandatory: false,
            name: "bind_dn",
            valueType: "String"
        }, {
            mandatory: false,
            name: "certificate",
            valueType: "String"
        }, {
            mandatory: false,
            name: "encryption",
            valueObjectPrototypeName: "LdapDirectoryParamsEncryption",
            valueType: "object"
        }, {
            mandatory: false,
            name: "group_suffix",
            valueType: "String"
        }, {
            mandatory: false,
            name: "krb_principal",
            valueType: "String"
        }, {
            mandatory: false,
            name: "krb_realm",
            valueType: "String"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server",
            valueType: "String"
        }, {
            mandatory: false,
            name: "user_suffix",
            valueType: "String"
        }, {
            mandatory: false,
            name: "verify_certificate",
            valueType: "boolean"
        }]
    }
});
