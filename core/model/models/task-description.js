var Montage = require("montage/core/core").Montage;

exports.TaskDescription = Montage.specialize({
    _format: {
        value: null
    },
    format: {
        set: function (value) {
            if (this._format !== value) {
                this._format = value;
            }
        },
        get: function () {
            return this._format;
        }
    },
    _message: {
        value: null
    },
    message: {
        set: function (value) {
            if (this._message !== value) {
                this._message = value;
            }
        },
        get: function () {
            return this._message;
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
