/**
 * @module ui/task-object.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TaskCategory
 * @extends Component
 */
exports.TaskCategory = Component.specialize(/** @lends TaskCategory# */ {
    enterDocument: {
        value: function () {
            this.classList.add('type-' + this.object.value.replace('.', '_'));
        }
    }
});
