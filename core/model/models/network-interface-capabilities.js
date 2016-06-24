var Montage = require("montage/core/core").Montage;
var NetworkInterfaceCapabilities = require("core/model/models/network-interface-capabilities").NetworkInterfaceCapabilities;

exports.NetworkInterfaceCapabilities = Montage.specialize({
    _add: {
        value: null
    },
    add: {
        set: function (value) {
            if (this._add !== value) {
                this._add = value;
            }
        },
        get: function () {
            return this._add || (this._add = new NetworkInterfaceCapabilities());
        }
    },
    _del: {
        value: null
    },
    del: {
        set: function (value) {
            if (this._del !== value) {
                this._del = value;
            }
        },
        get: function () {
            return this._del || (this._del = new NetworkInterfaceCapabilities());
        }
    }
});
