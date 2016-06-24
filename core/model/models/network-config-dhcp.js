var Montage = require("montage/core/core").Montage;

exports.NetworkConfigDhcp = Montage.specialize({
    _assign_dns: {
        value: null
    },
    assign_dns: {
        set: function (value) {
            if (this._assign_dns !== value) {
                this._assign_dns = value;
            }
        },
        get: function () {
            return this._assign_dns;
        }
    },
    _assign_gateway: {
        value: null
    },
    assign_gateway: {
        set: function (value) {
            if (this._assign_gateway !== value) {
                this._assign_gateway = value;
            }
        },
        get: function () {
            return this._assign_gateway;
        }
    }
});
