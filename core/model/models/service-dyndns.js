var Montage = require("montage").Montage;

exports.ServiceDyndns = Montage.specialize({
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
    _domains: {
        value: null
    },
    domains: {
        set: function (value) {
            if (this._domains !== value) {
                this._domains = value;
            }
        },
        get: function () {
            return this._domains;
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
    _force_update_period: {
        value: null
    },
    force_update_period: {
        set: function (value) {
            if (this._force_update_period !== value) {
                this._force_update_period = value;
            }
        },
        get: function () {
            return this._force_update_period;
        }
    },
    _ipserver: {
        value: null
    },
    ipserver: {
        set: function (value) {
            if (this._ipserver !== value) {
                this._ipserver = value;
            }
        },
        get: function () {
            return this._ipserver;
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
    _provider: {
        value: null
    },
    provider: {
        set: function (value) {
            if (this._provider !== value) {
                this._provider = value;
            }
        },
        get: function () {
            return this._provider;
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
    _update_period: {
        value: null
    },
    update_period: {
        set: function (value) {
            if (this._update_period !== value) {
                this._update_period = value;
            }
        },
        get: function () {
            return this._update_period;
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
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "domains",
            valueType: "array"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "force_update_period",
            valueType: "number"
        }, {
            mandatory: false,
            name: "ipserver",
            valueType: "String"
        }, {
            mandatory: false,
            name: "password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "provider",
            valueObjectPrototypeName: "ServiceDyndnsProvider",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "update_period",
            valueType: "number"
        }, {
            mandatory: false,
            name: "username",
            valueType: "String"
        }]
    }
});
