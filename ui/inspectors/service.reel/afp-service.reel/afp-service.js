var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class AfpService
 * @extends Component
 */
exports.AfpService = Component.specialize({

    users: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            var self = this;

            this.application.dataService.fetchData(Model.User).then(function(users) {
                self.users = users;
            });
        }
    }

});
