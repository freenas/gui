var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RsyncdModuleMode = require("core/model/enumerations/RsyncdModuleMode").RsyncdModuleMode,
    Promise = require("montage/core/promise").Promise;


exports.RsyncdModule = AbstractInspector.specialize({

    _loadUsersIfNeeded: {
        value: function() {
            var self = this;
            return this._sectionService.listUsers().then(function (users) {
                return self.users = users;
            });
        }
    },

    _loadGroupsIfNeeded: {
        value: function() {
            var self = this;
            return this._sectionService.listGroups().then(function(groups) {
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


            this.rsyncdModeOptions = this.cleanupEnumeration(RsyncdModuleMode).map(function(x) {
               return {
                    value: x,
                    label: x
                };
            });
        }
    },

});
