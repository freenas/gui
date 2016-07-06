/**
 * @module ui/network-configuration.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class NetworkConfiguration
 * @extends Component
 */
exports.NetworkConfiguration = Component.specialize(/** @lends NetworkConfiguration# */ {

    save: {
        value: function() {
            this.application.dataService.saveDataObject(this.object);
            this.application.dataService.saveDataObject(this.object.general);
        }
    }
});
