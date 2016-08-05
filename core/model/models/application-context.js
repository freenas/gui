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
    _sideBarContext: {
        value: null
    },
    sideBarContext: {
        set: function (value) {
            if (this._sideBarContext !== value) {
                this._sideBarContext = value;
            }
        },
        get: function () {
            return this._sideBarContext;
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
            name: "sideBarContext",
            valueObjectPrototypeName: "SideBarContext",
            valueType: "object"
        }]
    }
});
