var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Accounts
 * @extends Component
 */
exports.Accounts = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            this.listUsers();
        }
    },

    listUsers: {
        value: function() {
            var self = this;

            return this.application.dataService.fetchData(Model.User).then(function (users) {
                self.users = users;
            });
        }
    }

});
