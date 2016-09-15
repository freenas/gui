var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.Vm = AbstractModel.specialize({
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
    _devices: {
        value: null
    },
    devices: {
        set: function (value) {
            if (this._devices !== value) {
                this._devices = value;
            }
        },
        get: function () {
            return this._devices;
        }
    },
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
    _guest_type: {
        value: null
    },
    guest_type: {
        set: function (value) {
            if (this._guest_type !== value) {
                this._guest_type = value;
            }
        },
        get: function () {
            return this._guest_type;
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
    _immutable: {
        value: null
    },
    immutable: {
        set: function (value) {
            if (this._immutable !== value) {
                this._immutable = value;
            }
        },
        get: function () {
            return this._immutable;
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
    _target: {
        value: null
    },
    target: {
        set: function (value) {
            if (this._target !== value) {
                this._target = value;
            }
        },
        get: function () {
            return this._target;
        }
    },
    _template: {
        value: null
    },
    template: {
        set: function (value) {
            if (this._template !== value) {
                this._template = value;
            }
        },
        get: function () {
            return this._template;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "config",
            valueType: "object"
        }, {
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "devices",
            valueObjectPrototypeName: "VmDevice",
            valueType: "array"
        }, {
            mandatory: false,
            name: "enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "guest_type",
            valueObjectPrototypeName: "VmGuestType",
            valueType: "object"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "immutable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "VmStatus",
            valueType: "object"
        }, {
            mandatory: false,
            name: "target",
            valueType: "String"
        }, {
            mandatory: false,
            name: "template",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Virtual Machines'",
            inspectorComponentModule: {
                id: 'ui/inspectors/virtual-machine.reel'
            },
            creatorComponentModule: {
                id: 'ui/inspectors/virtual-machine.reel'
            },
            nameExpression: "_isNew.defined() && _isNew ? 'New VM' : name",
            statusColorMapping: {
                "RUNNING": "green",
                "BOOTLOADER": "green",
                "STOPPED": "grey"
            },
            statusValueExpression: "status.state"
        }
    }
});
