var Montage = require("montage/core/core").Montage;

exports.PowerChanged = Montage.specialize({
    _operation: {
        value: null
    },
    operation: {
        set: function (value) {
            if (this._operation !== value) {
                this._operation = value;
            }
        },
        get: function () {
            return this._operation;
        }
    }
});
