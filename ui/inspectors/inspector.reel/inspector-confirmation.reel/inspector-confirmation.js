var Component = require("montage/ui/component").Component;

exports.InspectorConfirmation = Component.specialize(/** @lends InspectorConfirmation# */ {

    confirmMessage: {
        value: null
    },

    inspector: {
        value: null
    },

    handleConfirmAction: {
        value: function () {
            if (this.inspector && typeof this.inspector[this.confirmMethod] === "function") {
                this.inspector[this.confirmMethod]();
            }
        }
    },

    handleCancelAction: {
        value: function() {
            if (this.inspector && typeof this.inspector[this.cancelMethod] === "function") {
                this.inspector[this.cancelMethod]();
            }
        }
    }
});
