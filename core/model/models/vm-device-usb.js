var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmDeviceUsb = AbstractModel.specialize({
    _config: {
        value: null
    },
    config: {
        set: function (value) {
            if (this._config !== value) {
                this._config = value;
            }
        },
        get: function () {
            return this._config;
        }
    },
    _device: {
        value: null
    },
    device: {
        set: function (value) {
            if (this._device !== value) {
                this._device = value;
            }
        },
        get: function () {
            return this._device;
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
            name: "config",
            valueType: "object"
        }, {
            mandatory: false,
            name: "device",
            valueObjectPrototypeName: "VmDeviceUsbDevice",
            valueType: "object"
        }, {
            mandatory: true,
            name: "type"
        }]
    }
});
