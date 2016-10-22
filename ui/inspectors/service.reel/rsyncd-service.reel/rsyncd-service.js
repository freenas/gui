var Component = require("montage/ui/component").Component;

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
             return this.application.rsyncdModuleService.list().then(function (rsyncdModules) {
                self.rsyncdModules = rsyncdModules;
            });
        }
    }
});
