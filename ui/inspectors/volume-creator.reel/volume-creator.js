var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class VolumeCreator
 * @extends Component
 */
exports.VolumeCreator = Component.specialize({
    _volumeDisksPromises: {
        value: {}
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this,
                volumes;
            this.object.topology = this.application.dataService.getDataObject(Model.ZfsTopology);
            this.object.topology.cache = [];
            this.object.topology.data = [];
            this.object.topology.log = [];
            return Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                self._volumeService = Volume.constructor;
                return self.application.dataService.fetchData(Model.Volume)
            }).then(function(_volumes) {
                volumes = _volumes;
                return self.application.dataService.fetchData(Model.Disk);
            }).then(function(disks) {
                var i, disksLength, disk,
                    j, volumesLength, volume,
                    disksVolumesPromises = [];
                for (i = 0, disksLength = disks.length; i < disksLength; i++) {
                    disk = disks[i];
                    for (j = 0, volumesLength = volumes.length; j < volumesLength; j++) {
                        volume = volumes[j];
                        disksVolumesPromises.push(self._checkIfDiskIsAssignedToVolume(disk, volume));
                    }
                }
                Promise.all(disksVolumesPromises).then(function() {
                    self.object.topology.spare = disks.filter(function(x) { return !x.volume });
                    self.disks = disks.filter(function(x) { return !x.volume });
                });
            });
        }
    },

    exitDocument: {
        value: function() {
        }
    },

    _checkIfDiskIsAssignedToVolume: {
        value: function (disk, volume) {
            var self = this,
                volumeDisksPromise;
            if (this._volumeDisksPromises[volume.id]) {
                volumeDisksPromise = this._volumeDisksPromises[volume.id];
            } else {
                this._volumeDisksPromises[volume.id] = volumeDisksPromise = this._volumeService.getVolumeDisks(volume.id);
            }
            return volumeDisksPromise.then(function(volumeDisks) {
                delete self._volumeDisksPromises[volume.id];
                volume.assignedDisks = volumeDisks;
                if (volumeDisks.indexOf('/dev/' + disk.status.gdisk_name) != -1) {
                    disk.volume = volume;
                }
            });
        }
    }

});
