var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmDeviceNic = AbstractModel.specialize({
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
            name: "bridge",
            valueType: "String"
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
