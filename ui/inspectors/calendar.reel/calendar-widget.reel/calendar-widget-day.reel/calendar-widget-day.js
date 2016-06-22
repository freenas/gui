/**
 * @module ui/calendar-widget-day.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class CalendarWidgetDay
 * @extends Component
 */
exports.CalendarWidgetDay = Component.specialize({
    _data: {
        value: null
    },

    data: {
        get: function() {
            return this._data;
        },
        set: function(data) {
            if (this._data !== data) {
                this._data = data;
                if (data) {
                    var self = this;
                    this.application.calendarService.getTasksScheduleOnDay(data).then(function(tasks) {
                        self.tasks = tasks;
                    });
                }
            }
        }
    }
});
