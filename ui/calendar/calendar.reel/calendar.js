var Component = require("montage/ui/component").Component;

/**
 * @class Calendar
 * @extends Component
 */
exports.Calendar = Component.specialize({
    events: {
        value: null
    },

    enterDocument: {
        value: function () {
            var self = this;
            this.application.calendarService.getCalendarInstance().then(function(calendar) {
                self.calendar = calendar;
            });
        }
    }

});
