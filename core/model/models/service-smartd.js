var Montage = require("montage").Montage;

exports.ServiceSmartd = Montage.specialize({
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
        }
    },
    _interval: {
        value: null
    },
    interval: {
        set: function (value) {
            if (this._interval !== value) {
                this._interval = value;
            }
        },
        get: function () {
            return this._interval;
        }
    },
    _power_mode: {
        value: null
    },
    power_mode: {
        set: function (value) {
            if (this._power_mode !== value) {
                this._power_mode = value;
            }
        },
        get: function () {
            return this._power_mode;
        }
    },
    _temp_critical: {
        value: null
    },
    temp_critical: {
        set: function (value) {
            if (this._temp_critical !== value) {
                this._temp_critical = value;
            }
        },
        get: function () {
            return this._temp_critical;
        }
    },
    _temp_difference: {
        value: null
    },
    temp_difference: {
        set: function (value) {
            if (this._temp_difference !== value) {
                this._temp_difference = value;
            }
        },
        get: function () {
            return this._temp_difference;
        }
    },
    _temp_informational: {
        value: null
    },
    temp_informational: {
        set: function (value) {
            if (this._temp_informational !== value) {
                this._temp_informational = value;
            }
        },
        get: function () {
            return this._temp_informational;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "interval",
            valueType: "number"
        }, {
            mandatory: false,
            name: "power_mode",
            valueObjectPrototypeName: "ServiceSmartdPowermode",
            valueType: "object"
        }, {
            mandatory: false,
            name: "temp_critical",
            valueType: "number"
        }, {
            mandatory: false,
            name: "temp_difference",
            valueType: "number"
        }, {
            mandatory: false,
            name: "temp_informational",
            valueType: "number"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
