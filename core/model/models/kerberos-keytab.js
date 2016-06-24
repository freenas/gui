var Montage = require("montage/core/core").Montage;

exports.KerberosKeytab = Montage.specialize({
    _entries: {
        value: null
    },
    entries: {
        set: function (value) {
            if (this._entries !== value) {
                this._entries = value;
            }
        },
        get: function () {
            return this._entries;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _keytab: {
        value: null
    },
    keytab: {
        set: function (value) {
            if (this._keytab !== value) {
                this._keytab = value;
            }
        },
        get: function () {
            return this._keytab;
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
