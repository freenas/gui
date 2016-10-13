/**
 * @module ui/docker-environment-input.reel
 */
var AbstractMultipleSelectController = require("ui/abstract/abstract-multiple-select-controller").AbstractMultipleSelectController;

/**
 * @class DockerEnvironmentInput
 * @extends AbstractMultipleSelectController
 */
exports.DockerEnvironmentInput = AbstractMultipleSelectController.specialize(/** @lends DockerEnvironmentInput# */ {

    canAddNewEntryExpression: {
        value: "!this.variableComponent.hasError && !this.valueComponent.hasError && !!this.variableComponent.value && !!this.valueComponent.value"
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
