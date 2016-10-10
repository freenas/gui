var Montage = require("montage").Montage;

exports.VmDeviceUsb = Montage.specialize({
    "_%type": {
        value: null
    },
    "%type": {
        set: function (value) {
            if (this["_%type"] !== value) {
                this["_%type"] = value;
            }
        },
        get: function () {
            return this["_%type"];
        }
    },
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: true,
            name: "%type"
        }, {
            mandatory: true,
            name: "config",
            valueType: "object"
        }, {
            mandatory: false,
            name: "device",
            valueObjectPrototypeName: "VmDeviceUsbDevice",
            valueType: "object"
        }]
    }
});
