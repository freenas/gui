var Component = require("montage/ui/component").Component,
    ServiceDyndnsProvider = require("core/model/enumerations/service-dyndns-provider").ServiceDyndnsProvider;

/**
 * @class DynamicDnsService
 * @extends Component
 */
exports.DynamicDnsService = Component.specialize({
    providerOptions: {
        value: null
    },
    
    templateDidLoad: {
        value: function() {
          this.providerOptions = ServiceDyndnsProvider.members;
        }
    },

    save: {
        value: function() {
            if (this.object.password === "" || this.object.password === null) {
                delete this.object.password;
            }
        }
    }
});
