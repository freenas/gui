var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RsyncdModuleMode = require("core/model/enumerations/rsyncd-module-mode").RsyncdModuleMode,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise;


exports.RsyncdModule = AbstractInspector.specialize({

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

    _loadUsersIfNeeded: {
        value: function() {
            if ((!this._fetchGroupsPromise && !this.users) || (this.users && this.users.length === 0)) {
                var self = this;

                this._fetchUsersPromise = this.application.dataService.fetchData(Model.User).then(function (users) {
                    self.users = users;
                    self._fetchUsersPromise = null;
                });
            }
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
        }
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            //Preload data before entering in the dom, in order to avoid graphic glitches
            this._loadUsersIfNeeded();
            this._loadGroupsIfNeeded();

            this.rsyncdModeOptions = RsyncdModuleMode.members.map(function(x) {
               return {
                    value: x,
                    label: x
                };
            });
        }
    },

    enterDocument: {
        value: function () {
            this._loadUsersIfNeeded();
            this._loadGroupsIfNeeded();
        }
    }

});
