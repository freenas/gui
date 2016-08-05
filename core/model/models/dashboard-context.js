var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.DashboardContext = AbstractModel.specialize({
    _widgets: {
        value: null
    },
    widgets: {
        set: function (value) {
            if (this._widgets !== value) {
                this._widgets = value;
            }
        },
        get: function () {
            return this._widgets;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "widgets",
            valueType: "array"
        }]
    }
});
