/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

/**
 * @class AlertNotification
 * @extends Component
 */
exports.AlertNotification = Component.specialize(/** @lends AlertNotification# */ {
    enterDocument: {
        value: function() {
            this.object.date = new Date(this.object.updated_at.$date);
        }
    },

    handleDismissButtonAction: {
        value: function(event) {
            this.object._dismissing = true;
            EventDispatcherService.getInstance().dispatch('alertDismiss', this.object);
            event.stopPropagation();
        }
    }
});
