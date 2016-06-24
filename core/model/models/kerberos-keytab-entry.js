var Montage = require("montage/core/core").Montage;

exports.KerberosKeytabEntry = Montage.specialize({
    _enctype: {
        value: null
    },
    enctype: {
        set: function (value) {
            if (this._enctype !== value) {
                this._enctype = value;
            }
        },
        get: function () {
            return this._enctype;
        }
    },
    _principal: {
        value: null
    },
    principal: {
        set: function (value) {
            if (this._principal !== value) {
                this._principal = value;
            }
        },
        get: function () {
            return this._principal;
        }
    },
    _vno: {
        value: null
    },
    vno: {
        set: function (value) {
            if (this._vno !== value) {
                this._vno = value;
            }
        },
        get: function () {
            return this._vno;
        }
    }
});
