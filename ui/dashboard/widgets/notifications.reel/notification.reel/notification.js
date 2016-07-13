/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Notification
 * @extends Component
 */
exports.Notification = Component.specialize(/** @lends Notification# */ {

    object: {
        value: null
    },

    infoExpanded: {
        value: false
    }
});
