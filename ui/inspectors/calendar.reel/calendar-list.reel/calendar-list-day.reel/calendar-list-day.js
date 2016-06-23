/**
 * @module ui/calendar-list-day.reel
 */
var Component = require("montage/ui/component").Component,
    monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * @class CalendarListDay
 * @extends Component
 */
exports.CalendarListDay = Component.specialize(/** @lends CalendarListDay# */ {
    _day: {
        value: null
    },

    day: {
        get: function() {
            return this._day;
        },
        set: function(day) {
            if (this._day !== day) {
                this._day = day;
                if (day) {
                    var self = this;
                    this.application.calendarService.getTasksScheduleOnDay(day).then(function(tasks) {
                        self.events = tasks;
                    });
                }
            }
        }
    },

    fullDate: {
        get: function() {
            return monthNames[this.day.month] + " " + this.day.date;
        }
    },

    _selectedDay: {
        value: null
    },

    selectedDay: {
        get: function() {
            return this._selectedDay;
        },
        set: function(selectedDay) {
            if (this._selectedDay !== selectedDay) {
                this._selectedDay = selectedDay;
                if (selectedDay == this._day) {
                    this.element.scrollIntoView();
                }
            }
        }
    }
});
