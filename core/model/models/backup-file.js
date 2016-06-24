var Montage = require("montage/core/core").Montage;

exports.BackupFile = Montage.specialize({
    _content_type: {
        value: null
    },
    content_type: {
        set: function (value) {
            if (this._content_type !== value) {
                this._content_type = value;
            }
        },
        get: function () {
            return this._content_type;
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
    },
    _size: {
        value: null
    },
    size: {
        set: function (value) {
            if (this._size !== value) {
                this._size = value;
            }
        },
        get: function () {
            return this._size;
        }
    }
});
