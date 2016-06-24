var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.SwapMirror = AbstractModel.specialize({
    _disks: {
        value: null
    },
    disks: {
        set: function (value) {
            if (this._disks !== value) {
                this._disks = value;
            }
        },
        get: function () {
            return this._disks;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "disks",
            valueType: "array"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }]
    }
});
