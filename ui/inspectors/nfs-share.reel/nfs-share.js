var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class NfsShare
 * @extends Component
 */
exports.NfsShare = Component.specialize({
    securityOptions: {
        value: [
            "sys",
            "krb5",
            "krb5i",
            "krb5p"
        ]
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
            if (isFirstTime) {
                this._loadUsers().then(function(users) {
                    self.users = users;
                });
                this._loadGroups().then(function(groups) {
                    self.groups = groups;
                });
            }
        }
    },

    _loadUsers: {
        value: function() {
            return this.application.dataService.fetchData(Model.User);
        }
    },

    _loadGroups: {
        value: function() {
            return this.application.dataService.fetchData(Model.Group);
        }
    }
});
