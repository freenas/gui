var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Accounts
 * @extends Component
 */
exports.Accounts = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            this.listUsers().then(function (users) {
                self.users = users;
            });
        }
    },

    listUsers: {
        value: function() {
            return this.application.dataService.fetchData(Model.User).then(function (users) {
                users.inspector = "ui/controls/viewer.reel";
                users.name = "Users";

                var user;

                for (var i = 0, length = users.length; i < length; i++) {
                    user = users[i];

                    user.name = user.username;
                    user.inspector = "ui/inspectors/user.reel";
                    user.icon = "ui/icons/user.reel";
                }

                return users;
            });
        }
    },

});
