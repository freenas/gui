var Montage = require("montage/core/core").Montage;

exports.SwapMirror = Montage.specialize({
    _disks: {
        value: null
    },
    disks: {
        set: function (value) {
            if (this._disks !== value) {
                this._disks = value;
            }
        },
        get: function () {
            return this._disks;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    }
});
