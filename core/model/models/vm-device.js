var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmDevice = AbstractModel.specialize({
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
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: true,
            name: "properties"
        }, {
            mandatory: true,
            name: "type",
            valueObjectPrototypeName: "VmDeviceType",
            valueType: "object"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            collectionNameExpression: "'Devices'",
            inspectorComponentModule: {
                id: 'ui/inspectors/virtual-machine-device.reel'
            },
            creatorComponentModule: {
                id: 'ui/inspectors/virtual-machine-device.reel'
            },
            nameExpression: "_isNew.defined() && _isNew ? 'New Device' : name"
        }
    }
});
