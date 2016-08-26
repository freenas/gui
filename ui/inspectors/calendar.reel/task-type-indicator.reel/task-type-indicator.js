/**
 * @module ui/inspectors/calendar.reel/task-type-indicator.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TaskTypeIndicator
 * @extends Component
 */
exports.TaskTypeIndicator = Component.specialize(/** @lends TaskTypeIndicator# */ {
    enterDocument: {
        value: function () {
            this.classList.add('type-' + this.object.task.replace('.', '_').toLowerCase());
        }
    },

    exitDocument: {
        value: function () {
            this.classList.remove('type-' + this.object.task.replace('.', '_').toLowerCase());
        }
    }
});
