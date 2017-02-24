var Component = require("montage/ui/component").Component;

exports.TableHosts = Component.specialize({
    tableWillUseNewEntry: {
        value: function () {
            return {
                _isNew: true,
                id: null,
                addresses: []
            }
        }
    },

    tableWillDeleteEntry: {
        value: function(host) {
            this.controller.markHostAsDeleted(host);
        }
    }
});
