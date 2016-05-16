/**
 * @module ui/task-object.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TaskObject
 * @extends Component
 */
exports.TaskObject = Component.specialize(/** @lends TaskObject# */ {
    enterDocument: {
        value: function () {
            this.classList.add('type-' + this.object.name);
        }
    }
});
