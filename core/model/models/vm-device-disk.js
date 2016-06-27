var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmDeviceDisk = AbstractModel.specialize({
    _mode: {
        value: null
    },
    mode: {
        set: function (value) {
            if (this._mode !== value) {
                this._mode = value;
            }
        },
        get: function () {
            return this._mode;
        }
    },
    _size: {
        value: null
    },
    size: {
        set: function (value) {
            if (this._size !== value) {
                this._size = value;
            }
        },
        get: function () {
            return this._size;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "mode",
            valueObjectPrototypeName: "VmDeviceDiskMode",
            valueType: "object"
        }, {
            mandatory: false,
            name: "size",
            valueType: "number"
        }]
    }
});
