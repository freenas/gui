/**
 * @module ui/inspector-confirmation.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class InspectorConfirmation
 * @extends Component
 */
exports.InspectorConfirmation = Component.specialize(/** @lends InspectorConfirmation# */ {

    handleConfirmDeleteAction: {
        value: function (event) {
            this.parentComponent.isConfirmationVisible = false;
            this.confirmDelete();
        }
    },

    handleCancelDeleteAction: {
        value: function() {
            this.parentComponent.isConfirmationVisible = false;
        }
    }
});
