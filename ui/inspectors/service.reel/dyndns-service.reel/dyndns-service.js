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
            this.providerOptions = ServiceDyndnsProvider.members.map(function(x) {
                return {
                    value: x,
                    // FIX ME: Ticket: #18103 -- x === "null" is required until fixed
                    label: x === "null" || !x ? 'None': x
                };
            });
        }
    }
});
