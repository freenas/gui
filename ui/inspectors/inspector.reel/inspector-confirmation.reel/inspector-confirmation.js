var Component = require("montage/ui/component").Component,
    _ = require("lodash");

exports.InspectorConfirmation = Component.specialize(/** @lends InspectorConfirmation# */ {

    confirmMessage: {
        value: null
    },

    inspector: {
        value: null
    },

    confirmExtra: {
        value: false
    },

    extraFlags: {
        value: []
    },

    exitDocument: {
        value: function() {
            this.confirmExtra = false;
        }
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
