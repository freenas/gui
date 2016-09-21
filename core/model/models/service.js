var Montage = require("montage").Montage;

exports.Service = Montage.specialize({
    _builtin: {
        value: null
    },
    builtin: {
        set: function (value) {
            if (this._builtin !== value) {
                this._builtin = value;
            }
        },
        get: function () {
            return this._builtin;
        }
    },
    _config: {
        value: null
    },
    config: {
        set: function (value) {
            if (this._config !== value) {
                this._config = value;
            }
        },
        get: function () {
            return this._config;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _pid: {
        value: null
    },
    pid: {
        set: function (value) {
            if (this._pid !== value) {
                this._pid = value;
            }
        },
        get: function () {
            return this._pid;
        }
    },
    _state: {
        value: null
    },
    state: {
        set: function (value) {
            if (this._state !== value) {
                this._state = value;
            }
        },
        get: function () {
            return this._state;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "builtin",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "config",
            valueObjectPrototypeName: "ServiceConfig",
            valueType: "object"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "pid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "state",
            valueObjectPrototypeName: "ServiceState",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/service.reel'
            },
            nameExpression: "config.type.replace('service-', '').toUpperCase()",
            statusColorMapping: {
                "RUNNING": "green",
                "UNKNOWN": "red",
                "STOPPED": "grey"
            },
            statusValueExpression: "state"
        }
    }
});
