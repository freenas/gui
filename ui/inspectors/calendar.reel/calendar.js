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
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this._calendarService = this.application.calendarService;
            }
            this.taskCategories = this._calendarService.taskCategories;
        }
    }

});
