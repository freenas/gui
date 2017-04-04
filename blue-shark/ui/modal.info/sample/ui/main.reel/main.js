/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    handleTriggerAction: {
        value: function() {
            this.modal.isShown = true;
        }
    }
});
