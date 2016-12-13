var Component = require("montage/ui/component").Component,
    ServiceDyndnsService = require("core/service/service-dyndns-service.js").ServiceDyndnsService;

/**
 * @class DynamicDnsService
 * @extends Component
 */
exports.DynamicDnsService = Component.specialize({
    providerOptions: {
        value: null
    },

    _serviceDyndnsService: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this._serviceDyndnsService = ServiceDyndnsService.instance;
            this._serviceDyndnsService.getProviders().then(function (dyndnsProviders) {
                self.providerOptions = Object.keys(dyndnsProviders).map(function(x) {
                    return {label: x, value: dyndnsProviders[x]};
                });
                self.providerOptions.unshift({label:"-",value:null});
            });
        }
    }
});
