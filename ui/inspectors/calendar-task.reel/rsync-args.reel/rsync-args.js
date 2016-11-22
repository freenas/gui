var Component = require("montage/ui/component").Component,
    RsyncCopyRsyncdirection = require('core/model/enumerations/rsync-copy-rsyncdirection').RsyncCopyRsyncdirection,
    RsyncCopyRsyncmode = require('core/model/enumerations/rsync-copy-rsyncmode').RsyncCopyRsyncmode,
    Model = require("core/model/model").Model;



exports.RsyncArgs = Component.specialize({
    
    _loadUsersIfNeeded: {
        value: function() {
            var self = this;
            return this.application.dataService.fetchData(Model.User).then(function (users) {
                return self.users = users;
            });
        }
    },

    templateDidLoad: {
        value: function() {
            var self = this;

            this._canDrawGate.setField("usersLoaded", false);

            this._loadUsersIfNeeded().then(function() {
                self._canDrawGate.setField("usersLoaded", true);
            });

            this.rsyncDirections = RsyncCopyRsyncdirection.members.map(function(x) {
                return {
                    label: x.toLowerCase().toCapitalized(),
                    value: x
                };
            });

            this.rsyncModes = RsyncCopyRsyncmode.members.map(function(x) {
                return {
                    label: x.toLowerCase().toCapitalized(),
                    value: x
                };
            });
        }
    },

    enterDocument: {
        value: function() {
            if (!this.object || this.object.length !== 1) {
                this.object = [{rsync_properties: {}}];
                this.object.__type = this.type;
            }
            this._extra = this.object[0].rsync_properties.extra;
        }
    },

    save: {
        value: function() {
            this.object[0].rsync_properties.extra = this._extra;
            return this.object;
        }
    }
});
