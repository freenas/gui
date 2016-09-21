var Montage = require("montage").Montage;

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
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "data",
            valueType: "array"
        }]
    }
});
