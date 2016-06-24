var Montage = require("montage/core/core").Montage;

exports.NetworkInterfaceVlan = Montage.specialize({
    _parent: {
        value: null
    },
    parent: {
        set: function (value) {
            if (this._parent !== value) {
                this._parent = value;
            }
        },
        get: function () {
            return this._parent;
        }
    },
    _tag: {
        value: null
    },
    tag: {
        set: function (value) {
            if (this._tag !== value) {
                this._tag = value;
            }
        },
        get: function () {
            return this._tag;
        }
    }
});
