var Montage = require("montage").Montage;

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
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "operation",
            valueObjectPrototypeName: "PowerChangedOperation",
            valueType: "object"
        }]
    }
});
