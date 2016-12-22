var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RsyncCopyRsyncdirection = require('core/model/enumerations/rsync-copy-rsyncdirection').RsyncCopyRsyncdirection,
    RsyncCopyRsyncmode = require('core/model/enumerations/rsync-copy-rsyncmode').RsyncCopyRsyncmode,
    Model = require("core/model/model").Model;



exports.RsyncArgs = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
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

            return this._sectionService.listUsers();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
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
