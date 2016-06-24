var Montage = require("montage/core/core").Montage;

exports.NetworkInterfaceBridge = Montage.specialize({
    _members: {
        value: null
    },
    members: {
        set: function (value) {
            if (this._members !== value) {
                this._members = value;
            }
        },
        get: function () {
            return this._members;
        }
    }
});
