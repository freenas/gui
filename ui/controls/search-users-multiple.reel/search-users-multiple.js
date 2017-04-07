var AbstractSearchAccountMultiple = require("ui/abstract/abstract-search-account-multiple").AbstractSearchAccountMultiple;

exports.SearchUsersMultiple = AbstractSearchAccountMultiple.specialize(/** @lends SearchGroups# */ {

    search: {
        value: function (value) {
            var self = this;

            return this.service.searchUser(value).then(function (users) {
                return users.map(function (user) {
                    user.username = self.service.formatAccountName(user, self.labelPath);
                    return user;
                });
            });
        }
    },

    loadInitialOptions: {
        value: function () {
            return this.service.listLocalUsers();
        }
    }

}, {

    labelPath: {
        value: 'username'
    }

});
