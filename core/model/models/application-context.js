var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.ApplicationContext = AbstractModel.specialize({
    _dashboardContext: {
        value: null
    },
    dashboardContext: {
        set: function (value) {
            if (this._dashboardContext !== value) {
                this._dashboardContext = value;
            }
        },
        get: function () {
            return this._dashboardContext;
        }
    },
    _sideBoardContext: {
        value: null
    },
    sideBoardContext: {
        set: function (value) {
            if (this._sideBoardContext !== value) {
                this._sideBoardContext = value;
            }
        },
        get: function () {
            return this._sideBoardContext;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "dashboardContext",
            valueObjectPrototypeName: "DashboardContext",
            valueType: "object"
        }, {
            mandatory: false,
            name: "sideBoardContext",
            valueObjectPrototypeName: "sideBoardContext",
            valueType: "object"
        }]
    }
});
