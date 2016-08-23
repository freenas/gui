/**
 * @module ui/debug.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Debug
 * @extends Component
 */
exports.Debug = Component.specialize(/** @lends Debug# */ {
    consoleData: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this.isLoading = true;
                this.application.systemAdvancedService.getSerialConsoleData().then(function(consoleData) {
                    self.object = consoleData.systemAdvanced;
                    self.isLoading = false;
                });
            }
        }
    },

    save: {
        value: function() {
            return this.application.systemAdvancedService.saveAdvanceData(this.object);
        }
    }
});
