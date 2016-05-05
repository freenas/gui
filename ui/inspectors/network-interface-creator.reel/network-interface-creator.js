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
            var self = this;
            if (isFirstTime) {
                this._dataService = this.application.dataService;
            }
            this.createNewInterface('Vlan').then(function(vlan) {
                self.newVlan = vlan;
            });
            this.createNewInterface('Lagg').then(function(lagg) {
                lagg.lagg.protocol = 'NONE';
                self.newLagg = lagg;
            });
            this.createNewInterface('Bridge').then(function(bridge) {
                self.newBridge = bridge;
            });
        }
    },

    createNewInterface: {
        value: function(type) {
            var self = this,
                newInterface;
            return this._dataService.getNewInstanceForType(Model.NetworkInterface).then(function(networkInterface) {
                newInterface = networkInterface;
                newInterface.type = type.toUpperCase();
                newInterface._isNewObject = true;
                newInterface.aliases = [];
                // FIXME: Hacks around combination of name not being nullable in the middleware
                // and certain form elements initializing the bound value to null. Remove if
                // either issue is resolved.
                newInterface.name = "";
                return self._dataService.getNewInstanceForType(Model['NetworkInterface' + type]);
            }).then(function(properties) {
                newInterface[type.toLowerCase()] = properties;
                return newInterface;
            });
        }
    }

});
