var Montage = require("montage").Montage;

exports.VmwareDataset = Montage.specialize({
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
    _datastore: {
        value: null
    },
    datastore: {
        set: function (value) {
            if (this._datastore !== value) {
                this._datastore = value;
            }
        },
        get: function () {
            return this._datastore;
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
    _peer: {
        value: null
    },
    peer: {
        set: function (value) {
            if (this._peer !== value) {
                this._peer = value;
            }
        },
        get: function () {
            return this._peer;
        }
    },
    _vm_filter_entries: {
        value: null
    },
    vm_filter_entries: {
        set: function (value) {
            if (this._vm_filter_entries !== value) {
                this._vm_filter_entries = value;
            }
        },
        get: function () {
            return this._vm_filter_entries;
        }
    },
    _vm_filter_op: {
        value: null
    },
    vm_filter_op: {
        set: function (value) {
            if (this._vm_filter_op !== value) {
                this._vm_filter_op = value;
            }
        },
        get: function () {
            return this._vm_filter_op;
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
            name: "datastore",
            valueType: "String"
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
            name: "peer",
            valueType: "String"
        }, {
            mandatory: false,
            name: "vm_filter_entries",
            valueType: "array"
        }, {
            mandatory: false,
            name: "vm_filter_op",
            valueObjectPrototypeName: "VmwareDatasetFilterOp",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                "id": "ui/sections/storage/inspectors/vmware-snapshot.reel"
            },
            collectionInspectorComponentModule: {
                "id": "ui/controls/viewer.reel"
            },
            collectionNameExpression: "'VMware Snapshots'",
            creatorComponentModule: {
                "id": "ui/sections/storage/inspectors/vmware-snapshot.reel"
            },
            nameExpression: "!!_isNew ? 'Add a VMware Snapshot' : name",
            sortExpression: "name"
        }
    }
});
