var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class AvailableDisks
 * @extends Component
 */
exports.AvailableDisks = Component.specialize( {

    disks: {
        value: null
    },

    _volumeDisksPromises: {
        value: {}
    },


    enterDocument: {
        value: function() {
            var self = this,
                volumes;

            if (this.disks) {
                this.disks.map(function(x) {
                    if (x.volume == '/TEMP/') {
                        x.volume = null;
                    }
                });
            }

            return this.application.dataService.fetchData(Model.Disk).then(function(disks) {
                self.disks = disks;
            });
/*
            return Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                self._volumeService = Volume.constructor;
                return self.application.dataService.fetchData(Model.Volume);
            }).then(function (_volumes) {
                volumes = _volumes;
                return self.application.dataService.fetchData(Model.Disk);
            }).then(function (disks) {
                var i, disksLength, disk,
                    j, volumesLength, volume,
                    disksVolumesPromises = [];
                for (i = 0, disksLength = disks.length; i < disksLength; i++) {
                    disk = disks[i];
                    disk.volume = null;
                    if (disk.status) {
                        for (j = 0, volumesLength = volumes.length; j < volumesLength; j++) {
                            volume = volumes[j];
                            disksVolumesPromises.push(self._checkIfDiskIsAssignedToVolume(disk, volume));
                        }
                    }
                }

                return Promise.all(disksVolumesPromises).then(function () {
                    self.disks = disks.filter(function (x) { return !x.volume });
                });
            });
*/
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
                if (volumeDisks.indexOf(disk.path) != -1) { disk.volume = volume; }
            });
        }
    }

});
