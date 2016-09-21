var Montage = require("montage").Montage;

exports.ServiceUps = Montage.specialize({
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
    _email_notify: {
        value: null
    },
    email_notify: {
        set: function (value) {
            if (this._email_notify !== value) {
                this._email_notify = value;
            }
        },
        get: function () {
            return this._email_notify;
        }
    },
    _email_recipients: {
        value: null
    },
    email_recipients: {
        set: function (value) {
            if (this._email_recipients !== value) {
                this._email_recipients = value;
            }
        },
        get: function () {
            return this._email_recipients;
        }
    },
    _email_subject: {
        value: null
    },
    email_subject: {
        set: function (value) {
            if (this._email_subject !== value) {
                this._email_subject = value;
            }
        },
        get: function () {
            return this._email_subject;
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
    _monitor_remote: {
        value: null
    },
    monitor_remote: {
        set: function (value) {
            if (this._monitor_remote !== value) {
                this._monitor_remote = value;
            }
        },
        get: function () {
            return this._monitor_remote;
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
            name: "email_notify",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "email_recipients",
            valueObjectPrototypeName: "Email",
            valueType: "array"
        }, {
            mandatory: false,
            name: "email_subject",
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
            name: "monitor_remote",
            valueType: "boolean"
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
