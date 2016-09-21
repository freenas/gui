var Montage = require("montage").Montage;

exports.Statistic = Montage.specialize({
    _alerts: {
        value: null
    },
    alerts: {
        set: function (value) {
            if (this._alerts !== value) {
                this._alerts = value;
            }
        },
        get: function () {
            return this._alerts;
        }
    },
    _last_value: {
        value: null
    },
    last_value: {
        set: function (value) {
            if (this._last_value !== value) {
                this._last_value = value;
            }
        },
        get: function () {
            return this._last_value;
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
    _short_name: {
        value: null
    },
    short_name: {
        set: function (value) {
            if (this._short_name !== value) {
                this._short_name = value;
            }
        },
        get: function () {
            return this._short_name;
        }
    },
    _unit: {
        value: null
    },
    unit: {
        set: function (value) {
            if (this._unit !== value) {
                this._unit = value;
            }
        },
        get: function () {
            return this._unit;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "alerts",
            valueObjectPrototypeName: "StatisticAlert",
            valueType: "object"
        }, {
            mandatory: false,
            name: "last_value",
            valueType: "number"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "short_name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "unit",
            valueType: "String"
        }]
    }
});
