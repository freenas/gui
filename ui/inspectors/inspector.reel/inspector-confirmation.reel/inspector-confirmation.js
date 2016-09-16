/**
 * @module ui/inspector-confirmation.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class InspectorConfirmation
 * @extends Component
 */
exports.InspectorConfirmation = Component.specialize(/** @lends InspectorConfirmation# */ {

    confirmDeleteMessage: {
        value: null
    },

    inspector: {
        value: null
    },

    handleConfirmDeleteAction: {
        value: function (event) {
            if (this.inspector && typeof this.inspector.confirmDelete === "function") {
                this.inspector.confirmDelete();
            }
        }
    },

    handleCancelDeleteAction: {
        value: function() {
            if (this.inspector && typeof this.inspector.cancelDelete === "function") {
                this.inspector.cancelDelete();
            }
        }
    }
});
