var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.NetworkConfigNetwait = AbstractModel.specialize({
    _addresses: {
        value: null
    },
    addresses: {
        set: function (value) {
            if (this._addresses !== value) {
                this._addresses = value;
            }
        },
        get: function () {
            return this._addresses;
        }
    },
    _enabled: {
        value: null
    },
    enabled: {
        set: function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
            }
        },
        get: function () {
            return this._enabled;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "addresses",
            valueType: "array"
        }, {
            mandatory: false,
            name: "enabled",
            valueType: "boolean"
        }]
    }
});
