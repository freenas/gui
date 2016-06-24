var Montage = require("montage/core/core").Montage;
var UnixModeTuple = require("core/model/models/unix-mode-tuple").UnixModeTuple;

exports.UnixPermissions = Montage.specialize({
    _group: {
        value: null
    },
    group: {
        set: function (value) {
            if (this._group !== value) {
                this._group = value;
            }
        },
        get: function () {
            return this._group || (this._group = new UnixModeTuple());
        }
    },
    _others: {
        value: null
    },
    others: {
        set: function (value) {
            if (this._others !== value) {
                this._others = value;
            }
        },
        get: function () {
            return this._others || (this._others = new UnixModeTuple());
        }
    },
    _user: {
        value: null
    },
    user: {
        set: function (value) {
            if (this._user !== value) {
                this._user = value;
            }
        },
        get: function () {
            return this._user || (this._user = new UnixModeTuple());
        }
    },
    _value: {
        value: null
    },
    value: {
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
            }
        },
        get: function () {
            return this._value;
        }
    }
});
