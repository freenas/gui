var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    DiskAcousticlevel = require("core/model/enumerations/disk-acousticlevel").DiskAcousticlevel;

exports.Disk = AbstractInspector.specialize({
    enterDocument: {
        value: function() {
            this.object._allocation = this._sectionService.getDiskAllocation(this.object);
            if (this.object._allocation && this.object._allocation.type == 'VOLUME') {
                this.object._vdev = this._sectionService.getVdev(this.object);
            }
        }
    },

    templateDidLoad: {
        value: function() {
            this.acousticLevelOptions = DiskAcousticlevel.members.map(function(x) {
                return {
                    label: x,
                    value: x
                };
            });
        }
    },

    handleEraseAction: {
        value: function() {
            return this._sectionService.eraseDisk(this.object);
        }
    },

    handleOfflineAction: {
        value: function() {
            return this._sectionService.offlineDisk(this.object._allocation.name, this.object._vdev);
        }
    },

    handleOnlineAction: {
        value: function() {
            return this._sectionService.onlineDisk(this.object._allocation.name, this.object._vdev);
        }
    }
});
