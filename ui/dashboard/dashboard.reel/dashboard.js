var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Dashboard
 * @extends Component
 */
exports.Dashboard = Component.specialize({
    interfaces: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this._dataService = this.application.dataService;

                // Fixme: Right now if this is done again after adding a new interface
                // it crashes due to missing data source. Once it's possible, have this
                // respond dynamically to all working interfaces in the system.
                this._dataService.fetchData(Model.NetworkInterface).then(function(interfaces){
                    self.interfaces = interfaces.filter(function(networkInterface){
                        return networkInterface.type === "ETHER" && networkInterface.enabled;
                    });
                });
            }
        }
    }
});
