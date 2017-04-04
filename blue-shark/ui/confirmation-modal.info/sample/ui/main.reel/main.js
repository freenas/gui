/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    result: {
        value: null
    },

    handleTriggerAction: {
        value: function() {
            this.modal.isShown = true;
        }
    },

    handleAction: {
        value: function (e) {
            if (e.detail) {
                this.result = e.detail.get('modalBoolean');
            }
        }
    }
});
