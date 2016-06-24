var Montage = require("montage/core/core").Montage;

exports.ActivedirectoryConfig = Montage.specialize({
    _binddn: {
        value: null
    },
    binddn: {
        set: function (value) {
            if (this._binddn !== value) {
                this._binddn = value;
            }
        },
        get: function () {
            return this._binddn;
        }
    },
    _bindpw: {
        value: null
    },
    bindpw: {
        set: function (value) {
            if (this._bindpw !== value) {
                this._bindpw = value;
            }
        },
        get: function () {
            return this._bindpw;
        }
    },
    _domain: {
        value: null
    },
    domain: {
        set: function (value) {
            if (this._domain !== value) {
                this._domain = value;
            }
        },
        get: function () {
            return this._domain;
        }
    }
});
