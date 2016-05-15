var Component = require("montage/ui/component").Component,
    notificationCenter = require("core/backend/notification-center").defaultNotificationCenter;

/**
 * @class Sideboard
 * @extends Component
 */
exports.Sideboard = Component.specialize({
    enterDocument: {
        value: function() {
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
