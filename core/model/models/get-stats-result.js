var Montage = require("montage/core/core").Montage;

exports.GetStatsResult = Montage.specialize({
    _data: {
        value: null
    },
    data: {
        set: function (value) {
            if (this._data !== value) {
                this._data = value;
            }
        },
        get: function () {
            return this._data;
        }
    }
});
