var Montage = require("montage").Montage;

exports.ServiceSnmp = Montage.specialize({
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
    _community: {
        value: null
    },
    community: {
        set: function (value) {
            if (this._community !== value) {
                this._community = value;
            }
        },
        get: function () {
            return this._community;
        }
    },
    _contact: {
        value: null
    },
    contact: {
        set: function (value) {
            if (this._contact !== value) {
                this._contact = value;
            }
        },
        get: function () {
            return this._contact;
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
    _location: {
        value: null
    },
    location: {
        set: function (value) {
            if (this._location !== value) {
                this._location = value;
            }
        },
        get: function () {
            return this._location;
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
    _v3: {
        value: null
    },
    v3: {
        set: function (value) {
            if (this._v3 !== value) {
                this._v3 = value;
            }
        },
        get: function () {
            return this._v3;
        }
    },
    _v3_auth_type: {
        value: null
    },
    v3_auth_type: {
        set: function (value) {
            if (this._v3_auth_type !== value) {
                this._v3_auth_type = value;
            }
        },
        get: function () {
            return this._v3_auth_type;
        }
    },
    _v3_password: {
        value: null
    },
    v3_password: {
        set: function (value) {
            if (this._v3_password !== value) {
                this._v3_password = value;
            }
        },
        get: function () {
            return this._v3_password;
        }
    },
    _v3_privacy_passphrase: {
        value: null
    },
    v3_privacy_passphrase: {
        set: function (value) {
            if (this._v3_privacy_passphrase !== value) {
                this._v3_privacy_passphrase = value;
            }
        },
        get: function () {
            return this._v3_privacy_passphrase;
        }
    },
    _v3_privacy_protocol: {
        value: null
    },
    v3_privacy_protocol: {
        set: function (value) {
            if (this._v3_privacy_protocol !== value) {
                this._v3_privacy_protocol = value;
            }
        },
        get: function () {
            return this._v3_privacy_protocol;
        }
    },
    _v3_username: {
        value: null
    },
    v3_username: {
        set: function (value) {
            if (this._v3_username !== value) {
                this._v3_username = value;
            }
        },
        get: function () {
            return this._v3_username;
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
            name: "community",
            valueType: "String"
        }, {
            mandatory: false,
            name: "contact",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "location",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "v3",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "v3_auth_type",
            valueObjectPrototypeName: "ServiceSnmpV3authtype",
            valueType: "object"
        }, {
            mandatory: false,
            name: "v3_password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "v3_privacy_passphrase",
            valueType: "String"
        }, {
            mandatory: false,
            name: "v3_privacy_protocol",
            valueObjectPrototypeName: "ServiceSnmpV3privacyprotocol",
            valueType: "object"
        }, {
            mandatory: false,
            name: "v3_username",
            valueType: "String"
        }]
    }
});
