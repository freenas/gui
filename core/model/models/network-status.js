var Montage = require("montage").Montage;

exports.NetworkStatus = Montage.specialize({
    _dns: {
        value: null
    },
    dns: {
        set: function (value) {
            if (this._dns !== value) {
                this._dns = value;
            }
        },
        get: function () {
            return this._dns;
        }
    },
    _gateway: {
        value: null
    },
    gateway: {
        set: function (value) {
            if (this._gateway !== value) {
                this._gateway = value;
            }
        },
        get: function () {
            return this._gateway;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "dns",
            valueType: "object"
        }, {
            mandatory: false,
            name: "gateway",
            valueType: "object"
        }]
    }
});
