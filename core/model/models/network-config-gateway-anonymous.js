var Montage = require("montage").Montage;

exports.NetworkConfigGatewayAnonymous = Montage.specialize({
    _ipv4: {
        value: null
    },
    ipv4: {
        set: function (value) {
            if (this._ipv4 !== value) {
                this._ipv4 = value;
            }
        },
        get: function () {
            return this._ipv4;
        }
    },
    _ipv6: {
        value: null
    },
    ipv6: {
        set: function (value) {
            if (this._ipv6 !== value) {
                this._ipv6 = value;
            }
        },
        get: function () {
            return this._ipv6;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "ipv4",
            valueObjectPrototypeName: "Ipv4Address",
            valueType: "object"
        }, {
            mandatory: false,
            name: "ipv6",
            valueObjectPrototypeName: "Ipv6Address",
            valueType: "object"
        }]
    }
});
