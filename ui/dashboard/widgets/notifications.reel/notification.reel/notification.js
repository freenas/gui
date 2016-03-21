/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Notification
 * @extends Component
 */
exports.Notification = Component.specialize(/** @lends Notification# */ {
    enterDocument: {
        value: function () {
            this.classList.add("Notification--" + this.object.type.toLowerCase());
            this.notificationIcon.setAttributeNS('http://www.w3.org/1999/xlink','href', ("#i-" + this.object.type.toLowerCase()));
        }
    }
});
