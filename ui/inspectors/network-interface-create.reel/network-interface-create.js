var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class NetworkInterfaceCreate
 * @extends Component
 */
exports.NetworkInterfaceCreate = Component.specialize({
    newVlan: {
        value: null
    },

    newLagg: {
        value: null
    },

    newBridge: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.newVlan = this.createNewInterface();
                this.newVlan.type = "VLAN";
                this.newLagg = this.createNewInterface();
                this.newLagg.type = "LAGG";
                this.newBridge = this.createNewInterface();
                this.newBridge.type = "BRIDGE";
            }
        }
    },

    createNewInterface: {
        value: function() {
            var newInterface = this.application.dataService.getDataObject(Model.NetworkInterface);
            newInterface.aliases = [];
            // FIXME: This creates an invisible network interface for some reason if it's false.
            newInterface.enabled = true;
            // FIXME: Hacks around combination of name not being nullable in the middleware
            // and certain form elements initializing the bound value to null. Remove if
            // either issue is resolved.
            newInterface.name = "";
            return newInterface;
        }
    }

});
