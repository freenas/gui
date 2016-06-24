var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.ContainerDevice = AbstractModel.specialize({
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
            name: "properties",
            valueType: "object"
        }, {
            mandatory: true,
            name: "type",
            valueObjectPrototypeName: "ContainerDeviceType",
            valueType: "object"
        }]
    }
});
