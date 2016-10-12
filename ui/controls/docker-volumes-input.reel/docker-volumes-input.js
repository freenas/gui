/**
 * @module ui/docker-volumes-input.reel
 */
var AbstractMultipleSelectInputController = require("ui/abstract/abstract-multiple-select-input-controller").AbstractMultipleSelectInputController;

/**
 * @class DockerVolumesInput
 * @extends AbstractMultipleSelectInputController
 */
exports.DockerVolumesInput = AbstractMultipleSelectInputController.specialize(/** @lends DockerVolumesInput# */ {

    canAddNewEntryExpression: {
        value: "this.containerPathComponent.hasError || this.hostPathComponent.hasError || !this.containerPathComponent.value || !this.hostPathComponent.value"
    },

    cleanCurrenEntry: {
        value: function () {
            this.hostPathComponent.value = null;
            this.containerPathComponent.value = null;
            this.readOnlyComponent.checked = false;
        }
    },

    getFormattedCurrentEntry: {
        value: function () {
            return this.hostPathComponent.value + " -> " + this.containerPathComponent.value;
        }
    }

});
