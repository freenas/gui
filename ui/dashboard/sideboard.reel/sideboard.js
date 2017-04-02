var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    notificationCenter = require("core/backend/notification-center").defaultNotificationCenter;

/**
 * @class Sideboard
 * @extends Component
 */
exports.Sideboard = AbstractComponentActionDelegate.specialize({
    enterDocument: {
        value: function (isFirstTime) {
            AbstractComponentActionDelegate.prototype.enterDocument.call(this, isFirstTime);

            this.notifications = notificationCenter.notifications;
        }
    },

    isCollapsed: {
        value: false
    },

    handleToggleSideboardAction: {
        value: function () {
            this.isCollapsed = !this.isCollapsed;
        }
    }
    
});
