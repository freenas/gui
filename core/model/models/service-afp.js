var Montage = require("montage").Montage;

exports.ServiceAfp = Montage.specialize({
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
    _connections_limit: {
        value: null
    },
    connections_limit: {
        set: function (value) {
            if (this._connections_limit !== value) {
                this._connections_limit = value;
            }
        },
        get: function () {
            return this._connections_limit;
        }
    },
    _dbpath: {
        value: null
    },
    dbpath: {
        set: function (value) {
            if (this._dbpath !== value) {
                this._dbpath = value;
            }
        },
        get: function () {
            return this._dbpath;
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
    _guest_enable: {
        value: null
    },
    guest_enable: {
        set: function (value) {
            if (this._guest_enable !== value) {
                this._guest_enable = value;
            }
        },
        get: function () {
            return this._guest_enable;
        }
    },
    _guest_user: {
        value: null
    },
    guest_user: {
        set: function (value) {
            if (this._guest_user !== value) {
                this._guest_user = value;
            }
        },
        get: function () {
            return this._guest_user;
        }
    },
    _homedir_enable: {
        value: null
    },
    homedir_enable: {
        set: function (value) {
            if (this._homedir_enable !== value) {
                this._homedir_enable = value;
            }
        },
        get: function () {
            return this._homedir_enable;
        }
    },
    _homedir_name: {
        value: null
    },
    homedir_name: {
        set: function (value) {
            if (this._homedir_name !== value) {
                this._homedir_name = value;
            }
        },
        get: function () {
            return this._homedir_name;
        }
    },
    _homedir_path: {
        value: null
    },
    homedir_path: {
        set: function (value) {
            if (this._homedir_path !== value) {
                this._homedir_path = value;
            }
        },
        get: function () {
            return this._homedir_path;
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
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "bind_addresses",
            valueType: "array"
        }, {
            mandatory: false,
            name: "connections_limit",
            valueType: "number"
        }, {
            mandatory: false,
            name: "dbpath",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "guest_enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "guest_user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "homedir_enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "homedir_name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "homedir_path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
