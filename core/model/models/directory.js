var Montage = require("montage").Montage;

exports.Directory = Montage.specialize({
    _enabled: {
        value: null
    },
    enabled: {
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
            }
        },
        get: function () {
            return this._enabled;
        }
    },
    _enumerate: {
        value: null
    },
    enumerate: {
        set: function (value) {
            if (this._enumerate !== value) {
                this._enumerate = value;
            }
        },
        get: function () {
            return this._enumerate;
        }
    },
    _gid_range: {
        value: null
    },
    gid_range: {
        set: function (value) {
            if (this._gid_range !== value) {
                this._gid_range = value;
            }
        },
        get: function () {
            return this._gid_range;
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
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    },
    _parameters: {
        value: null
    },
    parameters: {
        set: function (value) {
            if (this._parameters !== value) {
                this._parameters = value;
            }
        },
        get: function () {
            return this._parameters;
        }
    },
    _status: {
        value: null
    },
    status: {
        set: function (value) {
            if (this._status !== value) {
                this._status = value;
            }
        },
        get: function () {
            return this._status;
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
    _uid_range: {
        value: null
    },
    uid_range: {
        set: function (value) {
            if (this._uid_range !== value) {
                this._uid_range = value;
            }
        },
        get: function () {
            return this._uid_range;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "enumerate",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "gid_range",
            valueType: "array"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "parameters",
            valueObjectPrototypeName: "DirectoryParams",
            valueType: "object"
        }, {
            mandatory: false,
            name: "status",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }, {
            mandatory: false,
            name: "uid_range",
            valueType: "array"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/accounts/inspectors/directory-services.reel/directory-service.reel'
            },
            nameExpression: "label",
            statusColorMapping: {
                "BOUND": "green",
                "FAILURE": "red",
                "DISABLED": "grey",
                "JOINING": "yellow",
                "EXITING": "yellow"
            },
            statusValueExpression: "!enabled || !status || !status.state ? 'DISABLED' : status.state"
        }
    }
});
