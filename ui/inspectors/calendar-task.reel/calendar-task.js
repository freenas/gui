var Component = require("montage/ui/component").Component;

/**
 * @class CalendarTask
 * @extends Component
 */
exports.CalendarTask = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.taskCategories = this.application.calendarService.taskCategories;
            }
            if (this.object && this.object.name) {
                this.classList.add('type-' + this.object.name.replace('.', '_').toLowerCase());
            }
        }
    },

    exitDocument: {
        value: function() {
            if (this.object && this.object.name) {
                this.classList.remove('type-' + this.object.name.replace('.', '_').toLowerCase());
            }
        }
    }

});
