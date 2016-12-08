var Component = require("montage/ui/component").Component,
    DashboardSectionService = require("core/service/section/dashboard-section-service").DashboardSectionService;

/**
 * @class NetworkTraffic
 * @extends Component
 */
exports.NetworkTraffic = Component.specialize({

    templateDidLoad: {
        value: function() {
            var self = this;
            DashboardSectionService.instance.then(function(sectionService) {
                self._sectionService = sectionService;
            });
        }
    },

    enterDocument: {
        value: function () {
            var self = this;

            if (!this.interfaces) {
                this._sectionService.loadNetworkInterfaces().then(function(interfaces) {
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
