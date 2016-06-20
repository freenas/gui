/**
 * @module ui/calendar-list-day.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CalendarListDay
 * @extends Component
 */
exports.CalendarListDay = Component.specialize(/** @lends CalendarListDay# */ {
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._calendarService = this.application.calendarService;
            }
            this._cancelListener = this.addRangeAtPathChangeListener("tasks", this, "_handleTasksChange");
        }
    },

    exitDocument: {
        value: function() {
            if (typeof this._cancelListener === "function") {
                this._cancelListener();
            }
        }
    },

    _handleTasksChange: {
        value: function() {
            var self = this;
            this._calendarService.getTasksScheduleOnDay(this.day).then(function(tasks) {
                self.events = tasks;
            });
        }
    }
});
