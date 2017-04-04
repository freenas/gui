/**
 * @module ui/date.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Date
 * @extends Component
 */
exports.Date = Component.specialize(/** @lends Date# */ {
    _value: {
        value: null
    },

    value: {
        get: function() {
            return this._value;
        },
        set: function (value) {
                value = value ? value : null;

            if (this._value != value) {
                this._value = value;

                if (value) {
                    this.currentMonth = new Date(value);
                }
                this.isCalendarShown = false;
            }
        }
    },

    _currentMonth: {
        value: null
    },

    currentMonth: {
        get: function() {
            return this._currentMonth;
        },
        set: function(currentMonth) {
            if (this._currentMonth != currentMonth) {
                this._currentMonth = currentMonth;
                this.days = this._getDaysInMonth(currentMonth);
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.today = new Date();
            this.today.setHours(0);
            this.today.setMinutes(0);
            this.today.setSeconds(0);
            this.today.setMilliseconds(0);
            if (!this.value) {
                if (!this.allowEmpty) {
                    this.value = this.today;
                }
                this.currentMonth = new Date(this.today);
            }
        }
    },

    handleDecrementAction: {
        value: function() {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()-1, 1);
            // FIXME: Hacky
            this.dateValue.element.focus();
        }
    },

    handleIncrementAction: {
        value: function() {
            this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()+1, 1);
            // FIXME: Hacky
            this.dateValue.element.focus();
        }
    },

    _getDaysInMonth: {
        value: function(date) {
            var days = [];

            for (var i = 1, daysInMonth = this._getLastDayOfMonth(date); i < daysInMonth; i++) {
                days.push(new Date(date.getFullYear(), date.getMonth(), i));
            }
            while (days[0].getDay() != 0) {
                days.unshift(new Date(days[0].getFullYear(), days[0].getMonth(), days[0].getDate()-1));
            }
            var lastDay = days[days.length-1];
            while (lastDay.getDay() != 6) {
                days.push(new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate()+1));
                lastDay = days[days.length-1];
            }

            return days;
        }
    },

    _getLastDayOfMonth: {
        value: function(date) {
            var dateCopy = new Date(date);
            dateCopy.setMonth(dateCopy.getMonth()+1);
            dateCopy.setDate(0);
            return dateCopy.getDate();
        }
    }
});
