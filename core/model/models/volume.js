var Montage = require("montage").Montage;

exports.Volume = Montage.specialize({
    _attributes: {
        value: null
    },
    attributes: {
        set: function (value) {
            if (this._attributes !== value) {
                this._attributes = value;
            }
        },
        get: function () {
            return this._attributes;
        }
    },
    _auto_unlock: {
        value: null
    },
    auto_unlock: {
        set: function (value) {
            if (this._auto_unlock !== value) {
                this._auto_unlock = value;
            }
        },
        get: function () {
            return this._auto_unlock;
        }
    },
    _encryption: {
        value: null
    },
    encryption: {
        set: function (value) {
            if (this._encryption !== value) {
                this._encryption = value;
            }
        },
        get: function () {
            return this._encryption;
        }
    },
    _guid: {
        value: null
    },
    guid: {
        set: function (value) {
            if (this._guid !== value) {
                this._guid = value;
            }
        },
        get: function () {
            return this._guid;
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
    _key_encrypted: {
        value: null
    },
    key_encrypted: {
        set: function (value) {
            if (this._key_encrypted !== value) {
                this._key_encrypted = value;
            }
        },
        get: function () {
            return this._key_encrypted;
        }
    },
    _mountpoint: {
        value: null
    },
    mountpoint: {
        set: function (value) {
            if (this._mountpoint !== value) {
                this._mountpoint = value;
            }
        },
        get: function () {
            return this._mountpoint;
        }
    },
    _params: {
        value: null
    },
    params: {
        set: function (value) {
            if (this._params !== value) {
                this._params = value;
            }
        },
        get: function () {
            return this._params;
        }
    },
    _password_encrypted: {
        value: null
    },
    password_encrypted: {
        set: function (value) {
            if (this._password_encrypted !== value) {
                this._password_encrypted = value;
            }
        },
        get: function () {
            return this._password_encrypted;
        }
    },
    _properties: {
        value: null
    },
    properties: {
        set: function (value) {
            if (this._properties !== value) {
                this._properties = value;
            }
        },
        get: function () {
            return this._properties;
        }
    },
    _providers_presence: {
        value: null
    },
    providers_presence: {
        set: function (value) {
            if (this._providers_presence !== value) {
                this._providers_presence = value;
            }
        },
        get: function () {
            return this._providers_presence;
        }
    },
    _rname: {
        value: null
    },
    rname: {
        set: function (value) {
            if (this._rname !== value) {
                this._rname = value;
            }
        },
        get: function () {
            return this._rname;
        }
    },
    _scan: {
        value: null
    },
    scan: {
        set: function (value) {
            if (this._scan !== value) {
                this._scan = value;
            }
        },
        get: function () {
            return this._scan;
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
    _topology: {
        value: null
    },
    topology: {
        set: function (value) {
            if (this._topology !== value) {
                this._topology = value;
            }
        },
        get: function () {
            return this._topology;
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
    _upgraded: {
        value: null
    },
    upgraded: {
        set: function (value) {
            if (this._upgraded !== value) {
                this._upgraded = value;
            }
        },
        get: function () {
            return this._upgraded;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "attributes",
            valueType: "object"
        }, {
            mandatory: false,
            name: "auto_unlock",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "encryption",
            valueObjectPrototypeName: "VolumeEncryption",
            valueType: "object"
        }, {
            mandatory: false,
            name: "guid",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "key_encrypted",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "mountpoint",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "params",
            valueType: "object"
        }, {
            mandatory: false,
            name: "password_encrypted",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "properties",
            readOnly: true,
            valueObjectPrototypeName: "VolumeProperties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "providers_presence",
            readOnly: true,
            valueObjectPrototypeName: "VolumeProviderspresence",
            valueType: "object"
        }, {
            mandatory: false,
            name: "rname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "scan",
            valueObjectPrototypeName: "ZfsScan",
            valueType: "object"
        }, {
            mandatory: false,
            name: "status",
            valueObjectPrototypeName: "VolumeStatus",
            valueType: "object"
        }, {
            mandatory: false,
            name: "topology",
            valueObjectPrototypeName: "ZfsTopology",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }, {
            mandatory: false,
            name: "upgraded",
            readOnly: true,
            valueType: "boolean"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Volumes'",
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/volume.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/storage/inspectors/volume-creator.reel'
            },
            nameExpression: "name.defined() ? name : id.defined() ? id : 'Create a volume'",
            sortExpression: "name.defined() + '' + id",
            statusColorMapping: {
                "ONLINE": "green",
                "OFFLINE": "grey",
                "UNAVAIL": "red",
                "FAULTED": "red",
                "DEGRADED": "yellow"
            },
            statusValueExpression: "properties.health.parsed",
            wizardComponentModuleId: "ui/sections/wizard/inspectors/volume.reel",
            wizardTitle: "Create a volume"
        }
    }
});
