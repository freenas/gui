var Component = require("montage/ui/component").Component,
    notificationCenter = require("core/backend/notification-center").defaultNotificationCenter;

/**
 * @class Notifications
 * @extends Component
 */
exports.Notifications = Component.specialize({
    notificationCenter: {
        get: function () {
            return notificationCenter;
        }
    },

    handleFilterButtonAction: {
        value: function () {
            this.classList.toggle('filters-expanded');
        }
    }
});
