/**
 * @module ui/docker-port-input.reel
 */
var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class DockerPortInput
 * @extends AbstractComponentActionDelegate
 */
exports.DockerPortInput = AbstractComponentActionDelegate.specialize(/** @lends DockerPortInput# */ {

    _extractCurrentEntry: {
        value: function () {
            var formattedCurrentEntry = this._getFormattedCurrentEntry();

            this.hostPortPortComponent.value =
                this.containerPortComponent.value = null;
            this.protocolsComponent.selectedValue = "TCP";

            return formattedCurrentEntry;
        }
    },

    _getFormattedCurrentEntry: {
        value: function () {
            return this.hostPortPortComponent.value + " -> " + this.containerPortComponent.value + " " +
                this.protocolsComponent.selectedValue;
        }
    }

});
