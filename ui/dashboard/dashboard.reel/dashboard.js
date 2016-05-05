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
                this.application.dataService.fetchData(Model.NetworkInterface).then(function(interfaces){
                    self.interfaces = interfaces;
                });
            }
        }
    }
});
