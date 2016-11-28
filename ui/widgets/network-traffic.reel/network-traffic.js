var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class NetworkTraffic
 * @extends Component
 */
exports.NetworkTraffic = Component.specialize({

    enterDocument: {
        value: function () {
            if (!this.interfaces) {
                var self = this;

                this.application.dataService.fetchData(Model.NetworkInterface).then(function (interfaces) {
                    self.interfaces = interfaces;
                });
            }
        }
    },

    transformValue: {
        value: function(value) {
            return value * 8;
        }
    }

});
