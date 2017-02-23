var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

exports.SharePermissions = AbstractInspector.specialize(/** @lends SharePermissions# */ {

    users: {
        value: null
    },

    groups: {
        value: null
    },

    _fetchUsersPromise: {
        value: null
    },

    _fetchGroupsPromise: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function () {
            return Promise.all([
                this._loadUsersIfNeeded(),
                this._loadGroupsIfNeeded()
            ]);
        }
    },

    _loadUsersIfNeeded: {
        value: function() {
            if ((!this._fetchGroupsPromise && !this.users) || (this.users && this.users.length === 0)) {
                var self = this;

                this._fetchUsersPromise = this.application.dataService.fetchData(Model.User).then(function (users) {
                    self.users = users;
                    self._fetchUsersPromise = null;
                });
            }
            return this._fetchUsersPromise;
        }
    },

    _loadGroupsIfNeeded: {
        value: function() {
            if ((!this._fetchGroupsPromise && !this.groups) || (this.groups && this.groups.length === 0)) {
                var self = this;

                this._fetchGroupsPromise = this.application.dataService.fetchData(Model.Group).then(function (groups) {
                    self.groups = groups;
                    self._fetchGroupsPromise = null;
                });
            }
            return this._fetchGroupsPromise;
        }
    }

});
