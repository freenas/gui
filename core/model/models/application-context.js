var Montage = require("montage").Montage;

exports.ApplicationContext = Montage.specialize({
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
    },
    _userSettings: {
        value: null
    },
    userSettings: {
        set: function (value) {
            if (this._userSettings !== value) {
                this._userSettings = value;
            }
        },
        get: function () {
            return this._userSettings;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "dashboardContext",
            valueType: "object"
        }, {
            mandatory: false,
            name: "sideBoardContext",
            valueType: "object"
        }, {
            mandatory: false,
            name: "userSettings",
            valueType: "object"
        }]
    }
});
