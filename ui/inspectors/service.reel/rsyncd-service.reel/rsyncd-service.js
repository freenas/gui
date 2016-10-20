var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class RsyncdService
 * @extends Component
 */
exports.RsyncdService = Component.specialize({
    rsyncdModules: {
        value: null
    },


    templateDidLoad: {
        value: function() {
            var self = this;
             return this.application.dataService.fetchData(Model.RsyncdModule).then(function (rsyncdModules) {
                self.rsyncdModules = rsyncdModules;
            });
        }
    }
});
