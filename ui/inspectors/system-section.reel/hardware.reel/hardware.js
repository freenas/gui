/**
 * @module ui/hardware.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Hardware
 * @extends Component
 */
exports.Hardware = Component.specialize(/** @lends Hardware# */ {

    consoleData: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if(isFirstTime) {
                this.isLoading = true;
                this.application.systemAdvancedService.getSystemAdvanced().then(function(consoleData) {
                    self.consoleData = consoleData;
                    self.object = consoleData.systemAdvanced;
                });
                this.isLoading = false;
            }
        }
    }

});
