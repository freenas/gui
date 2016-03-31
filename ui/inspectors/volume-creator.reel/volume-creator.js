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

    emptyDisksArray: {
        value: null
    },

    _initializeTopology: {
        value: function () {
            var self = this,
                volumes;
            this.emptyDisksArray = this.application.dataService.getEmptyCollectionForType(Model.Disk);
            this.object.topology = this.application.dataService.getDataObject(Model.ZfsTopology);
            this.object.topology.cache = [];
            this.object.topology.data = [];
            this.object.topology.log = [];
            this.object.topology.spare = [];
            return Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                self._volumeService = Volume.constructor;
                return self.application.dataService.fetchData(Model.Volume)
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
                Promise.all(disksVolumesPromises).then(function () {
                    self.disks = disks.filter(function (x) { return !x.volume });
                });
            });
        }
    },

    enterDocument: {
        value: function() {
            return this._initializeTopology();
        }
    },

    exitDocument: {
        value: function() {
            this.disks.map(function(x) { delete x.volume; });
        }
    },

    _getDefaultVdevType: {
        value: function(disksCount) {
            var type;
            if (disksCount >=3) {
                type = 'raidz1'
            } else if (disksCount == 2) {
                type = 'mirror'
            } else {
                type = 'disk'
            }
            return type;
        }
    },

    _cleanupVdevs: {
        value: function (storageType) {
            var i, vdevsLength, vdev,
                j, disksLength, disk,
                type, path;
            for (i = 0, vdevsLength = storageType.length; i < vdevsLength; i++) {
                vdev = storageType[i];
                for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                    disk = vdev.children[j];
                    path = disk.path;
                    if (path.indexOf('/dev/') != 0) {
                        path = '/dev/' + path;
                    }
                    vdev.children[j] = {
                        path: path,
                        type: 'disk'
                    };
                }

                if (vdev.children.length > 1) {
                    type = vdev.type || this._getDefaultVdevType(vdev.children.length);
                    storageType[i] = {
                        children: vdev.children,
                        type: type
                    }
                } else {
                    storageType[i] = vdev.children[0];
                }
            }
            return storageType;
        }
    },

    _cleanupTopology: {
        value: function() {
            this.object.topology = {
                data: this._cleanupVdevs(this.object.topology.data),
                cache: this._cleanupVdevs(this.object.topology.cache),
                log: this._cleanupVdevs(this.object.topology.log),
                spare: this._cleanupVdevs(this.object.topology.spare)
            };
            this.object.type = 'zfs';
            this.object._isNew = true;
        }
    },

    revert: {
        value: function() {
            this._initializeTopology();

        }
    },

    save: {
        value: function() {
            this._cleanupTopology();
            this.application.dataService.saveDataObject(this.object);
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
