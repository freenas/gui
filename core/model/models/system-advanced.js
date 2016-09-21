var Montage = require("montage").Montage;

exports.SystemAdvanced = Montage.specialize({
    _boot_scrub_internal: {
        value: null
    },
    boot_scrub_internal: {
        set: function (value) {
            if (this._boot_scrub_internal !== value) {
                this._boot_scrub_internal = value;
            }
        },
        get: function () {
            return this._boot_scrub_internal;
        }
    },
    _console_cli: {
        value: null
    },
    console_cli: {
        set: function (value) {
            if (this._console_cli !== value) {
                this._console_cli = value;
            }
        },
        get: function () {
            return this._console_cli;
        }
    },
    _console_screensaver: {
        value: null
    },
    console_screensaver: {
        set: function (value) {
            if (this._console_screensaver !== value) {
                this._console_screensaver = value;
            }
        },
        get: function () {
            return this._console_screensaver;
        }
    },
    _debugkernel: {
        value: null
    },
    debugkernel: {
        set: function (value) {
            if (this._debugkernel !== value) {
                this._debugkernel = value;
            }
        },
        get: function () {
            return this._debugkernel;
        }
    },
    _home_directory_root: {
        value: null
    },
    home_directory_root: {
        set: function (value) {
            if (this._home_directory_root !== value) {
                this._home_directory_root = value;
            }
        },
        get: function () {
            return this._home_directory_root;
        }
    },
    _motd: {
        value: null
    },
    motd: {
        set: function (value) {
            if (this._motd !== value) {
                this._motd = value;
            }
        },
        get: function () {
            return this._motd;
        }
    },
    _periodic_notify_user: {
        value: null
    },
    periodic_notify_user: {
        set: function (value) {
            if (this._periodic_notify_user !== value) {
                this._periodic_notify_user = value;
            }
        },
        get: function () {
            return this._periodic_notify_user;
        }
    },
    _powerd: {
        value: null
    },
    powerd: {
        set: function (value) {
            if (this._powerd !== value) {
                this._powerd = value;
            }
        },
        get: function () {
            return this._powerd;
        }
    },
    _serial_console: {
        value: null
    },
    serial_console: {
        set: function (value) {
            if (this._serial_console !== value) {
                this._serial_console = value;
            }
        },
        get: function () {
            return this._serial_console;
        }
    },
    _serial_port: {
        value: null
    },
    serial_port: {
        set: function (value) {
            if (this._serial_port !== value) {
                this._serial_port = value;
            }
        },
        get: function () {
            return this._serial_port;
        }
    },
    _serial_speed: {
        value: null
    },
    serial_speed: {
        set: function (value) {
            if (this._serial_speed !== value) {
                this._serial_speed = value;
            }
        },
        get: function () {
            return this._serial_speed;
        }
    },
    _swapondrive: {
        value: null
    },
    swapondrive: {
        set: function (value) {
            if (this._swapondrive !== value) {
                this._swapondrive = value;
            }
        },
        get: function () {
            return this._swapondrive;
        }
    },
    _uploadcrash: {
        value: null
    },
    uploadcrash: {
        set: function (value) {
            if (this._uploadcrash !== value) {
                this._uploadcrash = value;
            }
        },
        get: function () {
            return this._uploadcrash;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "boot_scrub_internal",
            valueType: "number"
        }, {
            mandatory: false,
            name: "console_cli",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "console_screensaver",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "debugkernel",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "home_directory_root",
            valueType: "String"
        }, {
            mandatory: false,
            name: "motd",
            valueType: "String"
        }, {
            mandatory: false,
            name: "periodic_notify_user",
            valueType: "number"
        }, {
            mandatory: false,
            name: "powerd",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "serial_console",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "serial_port",
            valueType: "String"
        }, {
            mandatory: false,
            name: "serial_speed",
            valueObjectPrototypeName: "SystemAdvancedSerialspeed",
            valueType: "object"
        }, {
            mandatory: false,
            name: "swapondrive",
            valueType: "number"
        }, {
            mandatory: false,
            name: "uploadcrash",
            valueType: "boolean"
        }]
    }
});
