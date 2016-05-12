var Component = require("montage/ui/component").Component,
    notificationCenter = require("core/backend/notification-center").defaultNotificationCenter;

/**
 * @class Notifications
 * @extends Component
 */
exports.Notifications = Component.specialize({

    isExpanded: {
        value: false
    },

    handleTransitionend: {
        value: function (e) {
            if (e.target === this.notificationsBody) {
                if (!this.isExpanded) {
                    this.items.selection.clear();
                }
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if(isFirstTime) {
                this.notificationsBody.addEventListener("transitionend", this, false);
                this.addRangeAtPathChangeListener("items.selection", this, "handleSelectionChange");
            }
        }
    },

    notificationCenter: {
        get: function () {
            return notificationCenter;
        }
    },

    handleSelectionChange: {
        value: function (added) {
            if (added.length > 0) {
                this.isExpanded = true;
            }
        }
    },

    handleBackButtonAction: {
        value: function () {
            this.isExpanded = false;
        }
    }
});
