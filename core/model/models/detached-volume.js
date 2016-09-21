var Montage = require("montage").Montage;

exports.DetachedVolume = Montage.specialize({
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "status",
            valueType: "String"
        }, {
            mandatory: false,
            name: "topology",
            valueObjectPrototypeName: "ZfsTopology",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Volumes'",
            inspectorComponentModule: {
                id: 'ui/inspectors/detached-volume.reel'
            },
            nameExpression: "name + ' (detached)'",
            sortExpression: "name.defined() + '' + id"
        }
    }
});
