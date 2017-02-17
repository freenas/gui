var Component = require("montage/ui/component").Component;
exports.TableRoutes = Component.specialize({
    tableWillUseNewEntry: {
        value: function () {
            return {
                _isNew: true,
                id: null,
                network: null,
                gateway: null
            }
        }
    },

    tableWillDeleteEntry: {
        value: function(route) {
            this.controller.markRouteAsDeleted(route);
        }
    }
});
