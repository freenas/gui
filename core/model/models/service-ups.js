var Montage = require("montage").Montage;

exports.ServiceUps = Montage.specialize({
    _allow_remote_connections: {
        value: null
    },
    allow_remote_connections: {
        set: function (value) {
            if (this._allow_remote_connections !== value) {
                this._allow_remote_connections = value;
            }
        },
        get: function () {
            return this._allow_remote_connections;
        }
    },
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
    _auxiliary_users: {
        value: null
    },
    auxiliary_users: {
        set: function (value) {
            if (this._auxiliary_users !== value) {
                this._auxiliary_users = value;
            }
        },
        get: function () {
            return this._auxiliary_users;
        }
    },
    _description: {
        value: null
    },
    description: {
        set: function (value) {
            if (this._description !== value) {
                this._description = value;
            }
        },
        get: function () {
            return this._description;
        }
    },
    _driver: {
        value: null
    },
    driver: {
        set: function (value) {
            if (this._driver !== value) {
                this._driver = value;
            }
        },
        get: function () {
            return this._driver;
        }
    },
    _driver_port: {
        value: null
    },
    driver_port: {
        set: function (value) {
            if (this._driver_port !== value) {
                this._driver_port = value;
            }
        },
        get: function () {
            return this._driver_port;
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
    _identifier: {
        value: null
    },
    identifier: {
        set: function (value) {
            if (this._identifier !== value) {
                this._identifier = value;
            }
        },
        get: function () {
            return this._identifier;
        }
    },
    _mode: {
        value: null
    },
    mode: {
        set: function (value) {
            if (this._mode !== value) {
                this._mode = value;
            }
        },
        get: function () {
            return this._mode;
        }
    },
    _monitor_password: {
        value: null
    },
    monitor_password: {
        set: function (value) {
            if (this._monitor_password !== value) {
                this._monitor_password = value;
            }
        },
        get: function () {
            return this._monitor_password;
        }
    },
    _monitor_user: {
        value: null
    },
    monitor_user: {
        set: function (value) {
            if (this._monitor_user !== value) {
                this._monitor_user = value;
            }
        },
        get: function () {
            return this._monitor_user;
        }
    },
    _powerdown: {
        value: null
    },
    powerdown: {
        set: function (value) {
            if (this._powerdown !== value) {
                this._powerdown = value;
            }
        },
        get: function () {
            return this._powerdown;
        }
    },
    _propagate_alerts: {
        value: null
    },
    propagate_alerts: {
        set: function (value) {
            if (this._propagate_alerts !== value) {
                this._propagate_alerts = value;
            }
        },
        get: function () {
            return this._propagate_alerts;
        }
    },
    _remote_host: {
        value: null
    },
    remote_host: {
        set: function (value) {
            if (this._remote_host !== value) {
                this._remote_host = value;
            }
        },
        get: function () {
            return this._remote_host;
        }
    },
    _remote_port: {
        value: null
    },
    remote_port: {
        set: function (value) {
            if (this._remote_port !== value) {
                this._remote_port = value;
            }
        },
        get: function () {
            return this._remote_port;
        }
    },
    _shutdown_mode: {
        value: null
    },
    shutdown_mode: {
        set: function (value) {
            if (this._shutdown_mode !== value) {
                this._shutdown_mode = value;
            }
        },
        get: function () {
            return this._shutdown_mode;
        }
    },
    _shutdown_timer: {
        value: null
    },
    shutdown_timer: {
        set: function (value) {
            if (this._shutdown_timer !== value) {
                this._shutdown_timer = value;
            }
        },
        get: function () {
            return this._shutdown_timer;
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
            name: "allow_remote_connections",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "auxiliary",
            valueType: "String"
        }, {
            mandatory: false,
            name: "auxiliary_users",
            valueType: "String"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "driver",
            valueType: "String"
        }, {
            mandatory: false,
            name: "driver_port",
            valueType: "String"
        }, {
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "identifier",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mode",
            valueObjectPrototypeName: "ServiceUpsMode",
            valueType: "object"
        }, {
            mandatory: false,
            name: "monitor_password",
            valueType: "String"
        }, {
            mandatory: false,
            name: "monitor_user",
            valueType: "String"
        }, {
            mandatory: false,
            name: "powerdown",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "propagate_alerts",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "remote_host",
            valueType: "String"
        }, {
            mandatory: false,
            name: "remote_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "shutdown_mode",
            valueObjectPrototypeName: "ServiceUpsShutdownmode",
            valueType: "object"
        }, {
            mandatory: false,
            name: "shutdown_timer",
            valueType: "number"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
