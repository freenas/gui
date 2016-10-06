/**
 * @module ui/calendar/week.reel/day-column.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class DayColumn
 * @extends Component
 */
exports.DayColumn = Component.specialize({
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
/*
            var self = this,
                taskDate = new Date(this.data.rawDate),
                targetBoundingRect = event.targetElement.getBoundingClientRect(),
                timeInMinutes = (event.pageY - targetBoundingRect.top) / targetBoundingRect.height * 1440;
            taskDate.setHours(Math.floor(timeInMinutes / 60));
            taskDate.setMinutes(timeInMinutes % 60);
            this.selectedDay = this.data;
            this.application.calendarService.getNewTask(taskDate).then(function(task) {
                self.selectedTask = task;
            });
*/
        }
    }
});
