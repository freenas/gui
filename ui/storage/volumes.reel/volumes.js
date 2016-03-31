var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    Model = require("core/model/model").Model;

/**
 * @class Volumes
 * @extends Component
 */
exports.Volumes = Component.specialize({
    _volumeService: {
        value: null
    },

    _dataService: {
        value: null
    },

    _volumesById: {
        value: {}
    },

    _spareDisks: {
        value: []
    },

    _disks: {
        value: null
    },

    _volumeDisksPromises: {
        value: {}
    },

    _volumes: {
        value: null
    },

    disks: {
        get: function() {
            return this._disks || [];
        },
        set: function(disks) {
            if (this._disks != disks) {
                this._disks = disks;
            }
        }
    },

    _shares: {
        value: null
    },

    shares: {
        get: function() {
            return this._shares;
        },
        set: function(shares) {
            if (this._shares != shares) {
                this._shares = shares;
            }
        }
    },

    _loadDependencies: {
        value: function () {
            var self = this;
            return this._listShares().then(function (shares) {
                self.shares = shares;
                return self._listSnapshots();
            }).then(function (snapshots) {
                self.snapshots = snapshots;
                return self._listDisks();
            }).then(function (disks) {
                self.disks = disks;
            });
        }
    },

    _listVolumes: {
        value: function () {
            return this._dataService.fetchData(Model.Volume);
        }
    },

    _initializeServices: {
        value: function () {
            var self = this;
            this._dataService = this.application.dataService;
            return Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                self._volumeService = Volume.constructor;
            }).then(function() {
                return Model.populateObjectPrototypeForType(Model.ZfsTopology);
            }).then(function() {
                return Model.populateObjectPrototypeForType(Model.Scrub);
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;

            if (isFirstTime) {
                self.addRangeAtPathChangeListener("shares", this, "handleSharesChange");
                self.addRangeAtPathChangeListener("volumes", this, "handleVolumesChange");
                self.addRangeAtPathChangeListener("_volumes", this, "handleVolumesChange");
                self.addRangeAtPathChangeListener("disks", this, "handleDisksChange");
                this._initializeServices().then(function() {
                    self.type = Model.Volume;
                    self._listVolumes().then(function(volumes) {
                        self._volumes = volumes;
                        return self._loadDependencies();
                    }).then(function () {
                        var volume,
                            i, length;
                        for (i = 0, length = self._volumes.length; i < length; i++) {
                            volume = self._volumes[i];
                            volume.shares = self.shares;
                            volume.snapshots = self.snapshots;
                            volume.disks = self.disks;
                        }
                        self.volumes = self._volumes;
                    });
                });
            }
        }
    },

    handleSharesChange: {
        value: function(shares) {
            var volumeNamePromise,
                volumeNamesPromises = [],
                share,
                i, length;
            for (i = 0, length = shares.length; i < length; i++) {
                share = shares[i];
                if (!share.volume) {
                    volumeNamePromise = this._getContainingVolume(share);
                } else {
                    volumeNamePromise = Promise.resolve(share.volume);
                }
                volumeNamesPromises.push(volumeNamePromise);
            }
            Promise.all(volumeNamesPromises).then(function(volumeNames) {
                for (i =0, length = shares.length; i < length; i++) {
                    shares[i].volume = volumeNames[i];
                }
            });
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
    },

    handleVolumesChange: {
        value: function(volumes) {
            var volume, i, volumesLength,
                disk, j, disksLength;
            for (i = 0, volumesLength = volumes.length; i < volumesLength; i++) {
                volume = volumes[i];
                for (j = 0, disksLength = this.disks.length; i < disksLength; i++) {
                    disk = this.disks[i];
                    if (disk.status) {
                        this._checkIfDiskIsAssignedToVolume(disk, volume);
                    }
                }
                volume.scrubs = this._dataService.getDataObject(Model.Scrub);
                this._volumesById[volume.id] = volume;
            }
        }
    },

    handleDisksChange: {
        value: function(disks) {
            var self = this,
                i, disksLength, disk,
                j, volumesLength, volume,
                disksVolumesPromises = [];
            for (i = 0, disksLength = disks.length; i < disksLength; i++) {
                disk = disks[i];
                if (disk.status) {
                    for (j = 0, volumesLength = this._volumes.length; j < volumesLength; j++) {
                        volume = this._volumes[j];
                        disksVolumesPromises.push(this._checkIfDiskIsAssignedToVolume(disk, volume));
                    }
                }
            }
            Promise.all(disksVolumesPromises).then(function() {
                self._spareDisks.splice(0, self._spareDisks.length);
                Array.prototype.push.apply(self._spareDisks, self.disks.filter(function(x) { return !x.volume }));
            });
        }
    },

    _listSnapshots: {
        value: function() {
            return this._dataService.fetchData(Model.VolumeSnapshot);
        }
    },

    _listShares: {
        value: function() {
            return this._dataService.fetchData(Model.Share);
        }
    },

    _listDisks: {
        value: function() {
            return this._dataService.fetchData(Model.Disk);
        }
    },

    _getContainingVolume: {
        value: function(share) {
            var self = this;
            return this._volumeService.decodePath(share.filesystem_path).then(function (decodedPath) {
                return self._volumesById[decodedPath[0]];
            });
        }
    }

});
