var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RsyncdModuleMode = require("core/model/enumerations/rsyncd-module-mode").RsyncdModuleMode,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise;


exports.RsyncdModule = AbstractInspector.specialize({

    _loadUsersIfNeeded: {
        value: function() {
            var self = this;
            return this.application.dataService.fetchData(Model.User).then(function (users) {
                return self.users = users;
            });
        }
    },

    _loadGroupsIfNeeded: {
        value: function() {
            var self = this;
            return this.application.dataService.fetchData(Model.Group).then(function(groups) {
                return self.groups = groups;
            });
        }
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this._canDrawGate.setField("accountsLoaded", false);

            Promise.all([
                this._loadUsersIfNeeded(),
                this._loadGroupsIfNeeded()
            ]).then(function() {
                self._canDrawGate.setField("accountsLoaded", true);
            });


            this.rsyncdModeOptions = RsyncdModuleMode.members.map(function(x) {
               return {
                    value: x,
                    label: x
                };
            });
        }
    },

});
