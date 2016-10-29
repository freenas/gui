var Montage = require("montage").Montage;

exports.VolumeSnapshot = Montage.specialize({
    _dataset: {
        value: null
    },
    dataset: {
        set: function (value) {
            if (this._dataset !== value) {
                this._dataset = value;
            }
        },
        get: function () {
            return this._dataset;
        }
    },
    _hidden: {
        value: null
    },
    hidden: {
        set: function (value) {
            if (this._hidden !== value) {
                this._hidden = value;
            }
        },
        get: function () {
            return this._hidden;
        }
    },
    _holds: {
        value: null
    },
    holds: {
        set: function (value) {
            if (this._holds !== value) {
                this._holds = value;
            }
        },
        get: function () {
            return this._holds;
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
    _lifetime: {
        value: null
    },
    lifetime: {
        set: function (value) {
            if (this._lifetime !== value) {
                this._lifetime = value;
            }
        },
        get: function () {
            return this._lifetime;
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
    _replicable: {
        value: null
    },
    replicable: {
        set: function (value) {
            if (this._replicable !== value) {
                this._replicable = value;
            }
        },
        get: function () {
            return this._replicable;
        }
    },
    _volume: {
        value: null
    },
    volume: {
        set: function (value) {
            if (this._volume !== value) {
                this._volume = value;
            }
        },
        get: function () {
            return this._volume;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "dataset",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hidden",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "holds",
            valueType: "object"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "lifetime",
            valueType: "number"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "properties",
            valueObjectPrototypeName: "VolumeSnapshotProperties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "replicable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "volume",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Snapshots'",
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/snapshot.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/storage/inspectors/snapshot.reel'
            },
            nameExpression: "id.defined() ? id : 'Create a snapshot'"
        }
    }
});
