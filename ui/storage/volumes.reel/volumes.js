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
                return self._listDatasets();
            }).then(function (datasets) {
                self.datasets = datasets;
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
                this._initializeServices().then(function() {
                    self.addRangeAtPathChangeListener("shares", self, "handleSharesChange");
                    self.addRangeAtPathChangeListener("volumes", self, "handleVolumesChange");
                    self.addRangeAtPathChangeListener("_volumes", self, "handleVolumesChange");
                    self.addRangeAtPathChangeListener("disks", self, "handleDisksChange");
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

    handleVolumesChange: {
        value: function(addedVolumes, removedVolumes) {
            var volume, i, volumesLength,
                disk, j, disksLength;
            for (i = 0, volumesLength = removedVolumes.length; i < volumesLength; i++) {
                volume = removedVolumes[i];
                for (j = 0, disksLength = this.disks.length; i < disksLength; i++) {
                    disk = this.disks[i];
                    if (disk.volume == volume) {
                        disk.volume = null;
                    }
                }
            }
            for (i = 0, volumesLength = addedVolumes.length; i < volumesLength; i++) {
                volume = addedVolumes[i];
                volume.shares = this.shares;
                volume.snapshots = this.snapshots;
                volume.disks = this.disks;
                volume.datasets = this.datasets;
                this._loadScrubsForVolume(volume);
                this._volumesById[volume.id] = volume;
                this._assignVolumeToDisks();
            }
        }
    },

    _loadScrubsForVolume: {
        value: function(volume) {
            this._dataService.getNewInstanceForType(Model.Scrub).then(function(scrub) {
                volume.scrubs = scrub;
            });
        }
    },

    handleDisksChange: {
        value: function(disks) {
            this._assignVolumeToDisks(disks);
        }
    },

    _assignVolumeToDisks: {
        value: function (disks) {
            disks = disks || this.disks;
            var self = this,
                i, disksLength, disk;
            disks = disks.filter(function (x) {
                return !!x.status;
            });
            Promise.all(disks.map(function (x) {
                return x.status
            })).then(function () {
                disks.map(function (x) { x._devicePath = x.path });
                self._volumeService.getDisksAllocation(disks.map(function (x) { return x._devicePath })).then(function (disksAllocations) {
                    for (i = 0, disksLength = disks.length; i < disksLength; i++) {
                        disk = disks[i];
                        if (disksAllocations[disk._devicePath]) {
                            disk.volume = self._volumesById[disksAllocations[disk._devicePath].name];
                            disk.isBoot = disksAllocations[disk._devicePath].type == 'BOOT';
                        }
                    }
                });
            });
        }
    },

    _listSnapshots: {
        value: function() {
            return this._dataService.fetchData(Model.VolumeSnapshot);
        }
    },

    _listDatasets: {
        value: function() {
            return this._dataService.fetchData(Model.VolumeDataset);
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
