/**
 * @module ui/docker-environment-input.reel
 */
var AbstractMultipleSelectInputController = require("ui/abstract/abstract-multiple-select-input-controller").AbstractMultipleSelectInputController;

/**
 * @class DockerEnvironmentInput
 * @extends AbstractMultipleSelectInputController
 */
exports.DockerEnvironmentInput = AbstractMultipleSelectInputController.specialize(/** @lends DockerEnvironmentInput# */ {

    canAddNewEntryExpression: {
        value: "this.variableComponent.hasError || this.valueComponent.hasError || !this.variableComponent.value || !this.valueComponent.value"
    },

    cleanCurrenEntry: {
        value: function () {
            this.variableComponent.value = null;
            this.valueComponent.value = null;
        }
    },

    getFormattedCurrentEntry: {
        value: function () {
            return this.variableComponent.value + "=" + this.valueComponent.value;
        }
    }
});
