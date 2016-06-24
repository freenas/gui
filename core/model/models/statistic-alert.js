var Montage = require("montage/core/core").Montage;

exports.StatisticAlert = Montage.specialize({
    _alert_high: {
        value: null
    },
    alert_high: {
        set: function (value) {
            if (this._alert_high !== value) {
                this._alert_high = value;
            }
        },
        get: function () {
            return this._alert_high;
        }
    },
    _alert_high_enabled: {
        value: null
    },
    alert_high_enabled: {
        set: function (value) {
            if (this._alert_high_enabled !== value) {
                this._alert_high_enabled = value;
            }
        },
        get: function () {
            return this._alert_high_enabled;
        }
    },
    _alert_low: {
        value: null
    },
    alert_low: {
        set: function (value) {
            if (this._alert_low !== value) {
                this._alert_low = value;
            }
        },
        get: function () {
            return this._alert_low;
        }
    },
    _alert_low_enabled: {
        value: null
    },
    alert_low_enabled: {
        set: function (value) {
            if (this._alert_low_enabled !== value) {
                this._alert_low_enabled = value;
            }
        },
        get: function () {
            return this._alert_low_enabled;
        }
    },
    _normalized_alert_high: {
        value: null
    },
    normalized_alert_high: {
        set: function (value) {
            if (this._normalized_alert_high !== value) {
                this._normalized_alert_high = value;
            }
        },
        get: function () {
            return this._normalized_alert_high;
        }
    },
    _normalized_alert_low: {
        value: null
    },
    normalized_alert_low: {
        set: function (value) {
            if (this._normalized_alert_low !== value) {
                this._normalized_alert_low = value;
            }
        },
        get: function () {
            return this._normalized_alert_low;
        }
    }
});
