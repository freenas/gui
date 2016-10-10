var Montage = require("montage").Montage;

exports.VmDeviceGraphics = Montage.specialize({
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
    _resolution: {
        value: null
    },
    resolution: {
        set: function (value) {
            if (this._resolution !== value) {
                this._resolution = value;
            }
        },
        get: function () {
            return this._resolution;
        }
    },
    _vnc_enabled: {
        value: null
    },
    vnc_enabled: {
        set: function (value) {
            if (this._vnc_enabled !== value) {
                this._vnc_enabled = value;
            }
        },
        get: function () {
            return this._vnc_enabled;
        }
    },
    _vnc_port: {
        value: null
    },
    vnc_port: {
        set: function (value) {
            if (this._vnc_port !== value) {
                this._vnc_port = value;
            }
        },
        get: function () {
            return this._vnc_port;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "resolution",
            valueObjectPrototypeName: "VmDeviceGraphicsResolution",
            valueType: "object"
        }, {
            mandatory: false,
            name: "vnc_enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "vnc_port",
            valueType: "number"
        }]
    }
});
