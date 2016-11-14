var Montage = require("montage").Montage;

exports.VolumeDataset = Montage.specialize({
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
    _last_replicated_at: {
        value: null
    },
    last_replicated_at: {
        set: function (value) {
            if (this._last_replicated_at !== value) {
                this._last_replicated_at = value;
            }
        },
        get: function () {
            return this._last_replicated_at;
        }
    },
    _last_replicated_by: {
        value: null
    },
    last_replicated_by: {
        set: function (value) {
            if (this._last_replicated_by !== value) {
                this._last_replicated_by = value;
            }
        },
        get: function () {
            return this._last_replicated_by;
        }
    },
    _mounted: {
        value: null
    },
    mounted: {
        set: function (value) {
            if (this._mounted !== value) {
                this._mounted = value;
            }
        },
        get: function () {
            return this._mounted;
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
    _permissions: {
        value: null
    },
    permissions: {
        set: function (value) {
            if (this._permissions !== value) {
                this._permissions = value;
            }
        },
        get: function () {
            return this._permissions;
        }
    },
    _permissions_type: {
        value: null
    },
    permissions_type: {
        set: function (value) {
            if (this._permissions_type !== value) {
                this._permissions_type = value;
            }
        },
        get: function () {
            return this._permissions_type;
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
    _temp_mountpoint: {
        value: null
    },
    temp_mountpoint: {
        set: function (value) {
            if (this._temp_mountpoint !== value) {
                this._temp_mountpoint = value;
            }
        },
        get: function () {
            return this._temp_mountpoint;
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
    _volsize: {
        value: null
    },
    volsize: {
        set: function (value) {
            if (this._volsize !== value) {
                this._volsize = value;
            }
        },
        get: function () {
            return this._volsize;
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
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "last_replicated_at",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "last_replicated_by",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mounted",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "mountpoint",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "permissions",
            valueObjectPrototypeName: "Permissions",
            valueType: "object"
        }, {
            mandatory: false,
            name: "permissions_type",
            valueObjectPrototypeName: "VolumeDatasetPermissionstype",
            valueType: "object"
        }, {
            mandatory: false,
            name: "properties",
            valueObjectPrototypeName: "VolumeDatasetProperties",
            valueType: "object"
        }, {
            mandatory: false,
            name: "rname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "temp_mountpoint",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "volsize",
            valueType: "number"
        }, {
            mandatory: false,
            name: "volume",
            valueType: "String"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/volume-dataset.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/storage/inspectors/volume-dataset.reel'
            },
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Datasets'",
            nameExpression: "name",
            infoExpression: "properties.used.value + ' / ' + properties.available.value + ' (' + (properties.used.parsed / properties.available.parsed * 100).toFixed(0) + '%)'"
        }
    }
});
