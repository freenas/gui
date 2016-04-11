var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class NetworkInterfaceCreator
 * @extends Component
 */
exports.NetworkInterfaceCreator = Component.specialize({
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
                this.newVlan = this.createNewInterface('VLAN');
                this.newLagg = this.createNewInterface('LAGG');
                this.newBridge = this.createNewInterface('BRIDGE');
            }
        }
    },

    createNewInterface: {
        value: function(type) {
            var newInterface = this.application.dataService.getDataObject(Model.NetworkInterface);
            newInterface.type = type;
            newInterface[type.toLowerCase()] = {};
            newInterface._isNewObject = true;
            newInterface.aliases = [];
            // FIXME: Hacks around combination of name not being nullable in the middleware
            // and certain form elements initializing the bound value to null. Remove if
            // either issue is resolved.
            newInterface.name = "";
            return newInterface;
        }
    }

});
