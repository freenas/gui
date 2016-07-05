var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.Volume = AbstractModel.specialize({
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
    _encrypted: {
        value: null
    },
    encrypted: {
        set: function (value) {
            if (this._encrypted !== value) {
                this._encrypted = value;
            }
        },
        get: function () {
            return this._encrypted;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "attributes",
            valueType: "object"
        }, {
            mandatory: false,
            name: "encrypted",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "encryption",
            valueObjectPrototypeName: "VolumeEncryption",
            valueType: "object"
        }, {
            mandatory: false,
            name: "guid",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "params",
            valueType: "object"
        }, {
            mandatory: false,
            name: "properties",
            valueObjectPrototypeName: "VolumeProperties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "providers_presence",
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
            name: "topology",
            valueObjectPrototypeName: "ZfsTopology",
            valueType: "object"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Volumes'",
            inspectorComponentModule: {
                id: 'ui/inspectors/volume.reel'
            },
            creatorComponentModule: {
                id: 'ui/inspectors/volume-creator.reel'
            },
            nameExpression: "id.defined() ? id : 'Create a volume'"
        }
    }
});
