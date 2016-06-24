var Montage = require("montage/core/core").Montage;

exports.NetworkInterfaceLagg = Montage.specialize({
    _ports: {
        value: null
    },
    ports: {
        set: function (value) {
            if (this._ports !== value) {
                this._ports = value;
            }
        },
        get: function () {
            return this._ports;
        }
    },
    _protocol: {
        value: null
    },
    protocol: {
        set: function (value) {
            if (this._protocol !== value) {
                this._protocol = value;
            }
        },
        get: function () {
            return this._protocol;
        }
    }
});
