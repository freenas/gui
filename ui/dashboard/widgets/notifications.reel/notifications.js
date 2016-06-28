var Component = require("montage/ui/component").Component,
    notificationCenter = require("core/backend/notification-center").defaultNotificationCenter;

/**
 * @class Notifications
 * @extends Component
 */
exports.Notifications = Component.specialize({

    svgIcon: {
        value: null
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
                // this.notificationsBody.addEventListener("transitionend", this, false);
                // this.addRangeAtPathChangeListener("items.selection", this, "handleSelectionChange");
                this.svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                this.svgIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#" + this.icon);
                this.iconElement.appendChild(this.svgIcon);
            }
        }
    },

    notificationCenter: {
        get: function () {
            return notificationCenter;
        }
    }
});
