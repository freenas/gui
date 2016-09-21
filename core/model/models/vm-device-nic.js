var Montage = require("montage").Montage;

exports.VmDeviceNic = Montage.specialize({
    "_@type": {
        value: null
    },
    "@type": {
        set: function (value) {
            if (this["_@type"] !== value) {
                this["_@type"] = value;
            }
        },
        get: function () {
            return this["_@type"];
        }
    },
    _bridge: {
        value: null
    },
    bridge: {
        set: function (value) {
            if (this._bridge !== value) {
                this._bridge = value;
            }
        },
        get: function () {
            return this._bridge;
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
    _link_address: {
        value: null
    },
    link_address: {
        set: function (value) {
            if (this._link_address !== value) {
                this._link_address = value;
            }
        },
        get: function () {
            return this._link_address;
        }
    },
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "@type"
        }, {
            mandatory: false,
            name: "bridge",
            valueType: "String"
        }, {
            mandatory: false,
            name: "device",
            valueObjectPrototypeName: "VmDeviceNicDevice",
            valueType: "object"
        }, {
            mandatory: false,
            name: "link_address",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mode",
            valueObjectPrototypeName: "VmDeviceNicMode",
            valueType: "object"
        }]
    }
});
