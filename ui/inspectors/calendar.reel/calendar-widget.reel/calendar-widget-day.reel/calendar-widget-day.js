/**
 * @module ui/calendar-widget-day.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

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
    },

    prepareForActivationEvents: {
        value: function() {
            var pressComposer = new PressComposer();
            this.addComposer(pressComposer);
            pressComposer.addEventListener("press", this);
            this.element.addEventListener("mouseover", this);
        }
    },

    handlePress: {
        value: function(event) {
            this.selectedDay = this.data;
        }
    }
});
