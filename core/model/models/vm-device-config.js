var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmDeviceConfig = AbstractModel.specialize({
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
            name: "vnc_enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "vnc_port",
            valueType: "number"
        }]
    }
});
