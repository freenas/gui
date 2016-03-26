var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Accounts
 * @extends Component
 */
exports.Accounts = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._listUsers();
                this._prefetchGroups();
            }
        }
    },

    _listUsers: {
        value: function() {
            var self = this;

            return this.application.dataService.fetchData(Model.User).then(function (users) {
                self.users = users;
            });
        }
    },

    _prefetchGroups: {
        value: function() {
            return this.application.dataService.fetchData(Model.Group);
        }
    }

});
