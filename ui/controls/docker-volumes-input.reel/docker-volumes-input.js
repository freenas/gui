/**
 * @module ui/docker-volumes-input.reel
 */
var AbstractMultipleSelectController = require("ui/abstract/abstract-multiple-select-controller").AbstractMultipleSelectController;

/**
 * @class DockerVolumesInput
 * @extends AbstractMultipleSelectController
 */
exports.DockerVolumesInput = AbstractMultipleSelectController.specialize(/** @lends DockerVolumesInput# */ {

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
