var Montage = require("montage").Montage;

exports.VmVolume = Montage.specialize({
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
            mandatory: true,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: true,
            name: "properties"
        }, {
            mandatory: false,
            name: "type"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/vms/inspectors/virtual-machine-device.reel'
            },
            creatorComponentModule: {
                id: 'ui/sections/vms/inspectors/virtual-machine-device.reel'
            },
            nameExpression: "!_isNew ? name : 'New Volume'",
            collectionNameExpression: "'Volumes'",
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            }
        }
    }
});
