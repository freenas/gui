var Montage = require("montage").Montage;

exports.SystemGeneral = Montage.specialize({
    _console_keymap: {
        value: null
    },
    console_keymap: {
        set: function (value) {
            if (this._console_keymap !== value) {
                this._console_keymap = value;
            }
        },
        get: function () {
            return this._console_keymap;
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
    _hostname: {
        value: null
    },
    hostname: {
        set: function (value) {
            if (this._hostname !== value) {
                this._hostname = value;
            }
        },
        get: function () {
            return this._hostname;
        }
    },
    _language: {
        value: null
    },
    language: {
        set: function (value) {
            if (this._language !== value) {
                this._language = value;
            }
        },
        get: function () {
            return this._language;
        }
    },
    _syslog_server: {
        value: null
    },
    syslog_server: {
        set: function (value) {
            if (this._syslog_server !== value) {
                this._syslog_server = value;
            }
        },
        get: function () {
            return this._syslog_server;
        }
    },
    _tags: {
        value: null
    },
    tags: {
        set: function (value) {
            if (this._tags !== value) {
                this._tags = value;
            }
        },
        get: function () {
            return this._tags;
        }
    },
    _timezone: {
        value: null
    },
    timezone: {
        set: function (value) {
            if (this._timezone !== value) {
                this._timezone = value;
            }
        },
        get: function () {
            return this._timezone;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "console_keymap",
            valueType: "String"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "language",
            valueType: "String"
        }, {
            mandatory: false,
            name: "syslog_server",
            valueType: "String"
        }, {
            mandatory: false,
            name: "tags",
            valueType: "array"
        }, {
            mandatory: false,
            name: "timezone",
            valueType: "String"
        }]
    },

    userInterfaceDescriptor: {
        value: {
            "wizardComponentModuleId": "ui/sections/wizard/inspectors/system.reel",
            "wizardTitle": "choose your region"
        }
    }
});
