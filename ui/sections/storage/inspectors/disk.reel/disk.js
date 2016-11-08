var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    DiskAcousticlevel = require("core/model/enumerations/disk-acousticlevel").DiskAcousticlevel;

/**
 * @class Disk
 * @extends Component
 */
exports.Disk = AbstractInspector.specialize({
    templateDidLoad: {
        value: function() {
            this.acousticLevelOptions = DiskAcousticlevel.members.map(function(x) {
                return {
                    label: x,
                    value: x
                };
            });
            this.addPathChangeListener('object.path', this, '_handleDiskChange');
        }
    },

    _handleDiskChange: {
        value: function() {
            var self = this;
            if (!this.object || !this.object.id) {
                this.object._canDelete = false;
            } else {
                this._sectionService.listAvailableDisks().then(function(disks) {
                    for (var i = 0; i < disks.length; i++) {
                        if (disks[i].path === self.object.path) {
                            self.object._canDelete = true;
                            return;
                        }
                    }
                    self.object._canDelete = false;
                });
            }
        }
    },

    delete: {
        value: function() {
            return this._sectionService.eraseDisk(this.object.id);
        }
    }
});
