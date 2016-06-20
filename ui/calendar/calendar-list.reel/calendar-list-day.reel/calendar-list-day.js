/**
 * @module ui/calendar-list-day.reel
 */
var Component = require("montage/ui/component").Component;

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
    }
});
