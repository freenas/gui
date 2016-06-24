var Montage = require("montage/core/core").Montage;

exports.NetworkConfigDns = Montage.specialize({
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
    _search: {
        value: null
    },
    search: {
        set: function (value) {
            if (this._search !== value) {
                this._search = value;
            }
        },
        get: function () {
            return this._search;
        }
    }
});
