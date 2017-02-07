var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DynamicDnsService
 * @extends Component
 */
exports.DynamicDnsService = AbstractInspector.specialize({
    providerOptions: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this._sectionService.getDyndnsProviders().then(function (dyndnsProviders) {
                self.providerOptions = Object.keys(dyndnsProviders).map(function(x) {
                    return {label: x, value: dyndnsProviders[x]};
                });
                self.providerOptions.unshift({label:"-",value:null});
            });
        }
    },

    save: {
        value: function() {
            if (this.object.password === null) {
                delete this.object.password;
            }
        }
    }
});
