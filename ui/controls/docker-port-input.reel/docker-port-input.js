/**
 * @module ui/docker-port-input.reel
 */
var AbstractMultipleSelectInputController = require("ui/abstract/abstract-multiple-select-input-controller").AbstractMultipleSelectInputController;

/**
 * @class DockerPortInput
 * @extends AbstractComponentActionDelegate
 */
exports.DockerPortInput = AbstractMultipleSelectInputController.specialize(/** @lends DockerPortInput# */ {

    canAddNewEntryExpression: {
        value: "this.containerPortComponent.hasError || this.hostPortComponent.hasError || !this.containerPortComponent.value || !this.hostPortComponent.value"
    },

    cleanCurrenEntry: {
        value: function () {
            this.hostPortComponent.value = null;
            this.containerPortComponent.value = null;
            this.protocolsComponent.selectedValue = "TCP";
        }
    },

    getFormattedCurrentEntry: {
        value: function () {
            return this.hostPortComponent.value + " -> " + this.containerPortComponent.value + " " +
                this.protocolsComponent.selectedValue;
        }
    }

});
