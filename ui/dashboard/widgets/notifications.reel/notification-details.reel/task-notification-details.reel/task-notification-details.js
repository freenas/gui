/**
 * @module ui/notification-details.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TaskNotificationDetails
 * @extends Component
 */
exports.TaskNotificationDetails = Component.specialize(/** @lends TaskNotificationDetails# */ {
    handleRetryButtonAction: {
        value: function () {
            this.application.section = this.application.selectionService.restoreTaskSelection(this.object.jobId);
        }
    }
});
