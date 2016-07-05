/**
 * @module ui/task-object.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class TaskCategory
 * @extends Component
 */
exports.TaskCategory = Component.specialize(/** @lends TaskCategory# */ {
    enterDocument: {
        value: function () {
            this.classList.add('type-' + this.object.value.replace('.', '_'));
        }
    },

    handleTaskButtonAction: {
        value: function(event) {
            this.object.isDisplayed = !this.object.isDisplayed;
        }
    },

    handleCreateAction: {
        value: function(event) {
            var self = this;
            this.application.calendarService.getNewTask(this.object.value).then(function(task) {
                self.newObject = task;
            });
        }
    }
});
