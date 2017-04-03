/**
 * @module ui/date.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Datetime
 * @extends Component
 */
exports.Datetime = Component.specialize(/** @lends Datetime# */ {
    _value: {
        value: null
    },

    value: {
        get: function() {
            return this._value;
        },
        set: function(value) {
            if (value === null) {
                this._time = null;
                this._date = null;
            }
            if (this._value !== value && !this._areDatesEqual(this._value, value)) {
                this._value = value;
                if (typeof value === 'object' && value) {
                    this._date = new Date(value);
                    this._time = new Date(value);
                }
            }
        }
    },

    __date: {
        value: null
    },

    _date: {
        get: function() {
            return this.__date;
        },
        set: function(date) {
            if (this.__date != date && !this._areDatesEqual(this.__date, date)) {
                this.__date = date;
                if (date) {
                    this.value = this._getValue();
                }
            }
        }
    },

    __time: {
        value: null
    },

    _time: {
        get: function() {
            return this.__time;
        },
        set: function(time) {
            if (this.__time != time && !this._areDatesEqual(this.__time, time)) {
                this.__time = time;
                if (time) {
                    this.value = this._getValue();
                }
            }
        }
    },

    exitDocument: {
        value: function() {
            this.__value = null;
            this.__date = null;
            this.__time = null;
        }
    },

    _getValue: {
        value: function() {
            if (this._date && this._time) {
                var date = new Date(this._date);
                date.setHours(this._time.getHours());
                date.setMinutes(this._time.getMinutes());
                return date;
            }
        }
    },

    _areDatesEqual: {
        value: function(dateA, dateB) {
            var result = false;
            if (dateA && typeof dateA.toISOString === "function") {
                if (dateB && typeof dateA.toISOString === "function") {
                    result = dateA.toISOString() == dateB.toISOString();
                }
            } else {
                result = !dateB;
            }
            return result;
        }
    }
});
