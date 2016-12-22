var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    Notification = require("ui/dashboard/notifications.reel/notification.reel").Notification,
    notificationCenter = require("core/backend/notification-center").defaultNotificationCenter;

/**
 * @class Notifications
 * @extends Component
 */
exports.Notifications = AbstractComponentActionDelegate.specialize({

    notificationCenter: {
        get: function () {
            return this.constructor.notificationCenter;
        }
    },

    handleRetryButtonAction: {
        value: function (event) {
            var iteration = this.items._findIterationContainingElement(event.target.element);

            if (iteration) {
                var taskSection = this.application.selectionService.restoreTaskSelection(iteration.object.jobId, iteration.object.taskReport);
                if (this.application.section !== taskSection) {
                    this.application.section = taskSection;
                } else {
                    this.application.selectionService.needsRefresh = true;
                }
            }
        }
    },

    handleExpandButtonAction: {
        value: function (event) {
            var iteration = this.items._findIterationContainingElement(event.target.element);

            if (iteration) {
                var childComponents = iteration._childComponents,
                    i = 0, length = childComponents.length,
                    notificationComponent;

                while (!notificationComponent && i < length) {
                    if (childComponents[i] instanceof Notification) {
                        notificationComponent = childComponents[i++];
                    }
                }

                if (notificationComponent) {
                    notificationComponent.infoExpanded = !notificationComponent.infoExpanded;
                }
            }
        }
    }

}, {

    notificationCenter: {
        value: notificationCenter
    }

});
