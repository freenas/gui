var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Service
 * @extends Component
 */
exports.Service = Component.specialize({
    systemGeneral: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                var self = this;
                return this.application.dataService.fetchData(Model.SystemGeneral).then(function(systemGeneral) {
                    self.systemGeneral = systemGeneral[0];
                });
            }
        }
    }
});
