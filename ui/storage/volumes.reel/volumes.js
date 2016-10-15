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

    _disks: {
        value: null
    },

    _volumes: {
        value: null
    },

    _sharePathDecodePromises: {
        value: {}
    },

    _diskAllocationPromises: {
        value: {}
    },

    _VOLUMES_METADATA: {
        value: { collectionModelType: Model.Volume }
    },

    disks: {
        get: function () {
            return this._disks || [];
        },
        set: function (disks) {
            if (this._disks !== disks) {
                this._disks = disks;
            }
        }
    },

    shares: {
        value: null
    },

    datasets: {
        value: null
    },

    _allVolumes: {
        value: null
    },

    allVolumes: {
        value: null
    },

    detachedVolumes: {
        value: null
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
                return self.datasets = datasets;
            }).then(function() {
                return self._scanDetachedVolumes();
            });
        }
    },

    _listVolumes: {
        value: function () {
            return this._dataService.fetchData(Model.Volume);
        }
    },

    _scanDetachedVolumes: {
        value: function() {
            var self = this;
            return this._volumeService.find().then(function(rawDetachedVolumes) {
                return Promise.all(rawDetachedVolumes.filter(function(x) {
                    return x.status === "ONLINE";
                }).map(function(x) {
                    return self._dataService.mapRawDataToType(x, Model.DetachedVolume).then(function(detachedVolume) {
                        detachedVolume.topology._isDetached = true;
                        return detachedVolume;
                    });
                }));
            }).then(function(detachedVolumes) {
                var i, length, volume;
                for (i = self._allVolumes.length - 1; i >= 0; i--) {
                    volume = self._allVolumes[i];
                    if (volume.topology._isDetached) {
                        self._allVolumes.splice(i, 1);
                    }
                }
                for (i = 0, length = detachedVolumes.length; i < length; i++) {
                    self._allVolumes.push(detachedVolumes[i]);
                }
            });
        }
    },

    _initializeServices: {
        value: function () {
            var self = this;
            this._dataService = this.application.dataService;

            return Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                self._volumeService = Volume.constructor.services;
            }).then(function() {
                return Model.populateObjectPrototypeForType(Model.ZfsTopology);
            }).then(function() {
                return Model.populateObjectPrototypeForType(Model.Scrub);
            });
        }
    },

    templateDidLoad: {
        value: function () {
            var self = this;


            this._initializeServices().then(function () {
                self.type = Model.Volume;

                self._allVolumes = [];
                self._allVolumes._meta_data = { collectionModelType: Model.Volume };
                return self._listVolumes().then(function (volumes) {
                    self._volumes = volumes;

                    return self._loadDependencies();
                }).then(function () {
                    self.allVolumes = self._allVolumes;
                    // Change listeners are set at the end of the initialization for security and performance reasons,
                    // Indeed, once they are set on the properties they will be automatically called with all the populated data.

                    self.addRangeAtPathChangeListener("_volumes", self, "handleVolumesChange");
                    self.addRangeAtPathChangeListener("shares", self, "handleSharesChange");
                    self.addRangeAtPathChangeListener("disks", self, "handleDisksChange");
                });
            });
        }
    },

    handleSharesChange: {
        value: function (plus) {
            if (plus && plus.length) {
                var share, i, length;

                for (i = 0, length = plus.length; i < length; i++) {
                    share = plus[i];

                    if (!share.volume) {
                        this._setVolumeForShare(share);
                    }
                }
            }

            //TODO: minus.
        }
    },

    handleVolumesChange: {
        value: function(addedVolumes, removedVolumes) {
            var self = this,
                volume, i, volumesLength, disk, j, disksLength;

            for (i = 0, volumesLength = removedVolumes.length; i < volumesLength; i++) {
                volume = removedVolumes[i];
                for (j = 0, disksLength = this.disks.length; i < disksLength; i++) {
                    disk = this.disks[i];
                    if (disk.volume == volume) {
                        disk.volume = null;
                    }
                }
                var volumeIndex = this.allVolumes.indexOf(volume);
                if (volumeIndex !== -1) {
                    this.allVolumes.splice(volumeIndex, 1);
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
                this.allVolumes.push(volume);
            }
            return this._scanDetachedVolumes();
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
        value: function(addedDisks, removedDisks) {
            var self = this,
                disk;
            for (var i = 0, length = removedDisks.length; i < length; i++) {
                disk = removedDisks[i];
                delete this._diskAllocationPromises[disk.path];
            }
            return this._assignVolumeToDisks(addedDisks).then(function() {
                return self._scanDetachedVolumes();
            });
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
            return Promise.all(disks.map(function (x) {
                return x.status;
            })).then(function () {
                var unrequestedDisks = disks.filter(function(x) { return !self._diskAllocationPromises[x.path]; }).map(function(x) { x._devicePath = x.path; return x; });
                if (unrequestedDisks.length > 0) {
                    var diskAllocationPromise = self._volumeService.getDisksAllocation(unrequestedDisks.map(function(x) { return x._devicePath; })).then(function (disksAllocations) {
                        for (i = 0, disksLength = disks.length; i < disksLength; i++) {
                            disk = disks[i];
                            if (disksAllocations[disk._devicePath]) {
                                disk.isBoot = disksAllocations[disk._devicePath].type == 'BOOT';
                                if (!disk.isBoot) {
                                    self._getDiskLabel(disk);
                                    disk.volume = self._volumesById[disksAllocations[disk._devicePath].name];
                                }
                            }
                            delete self._diskAllocationPromises[disk._devicePath];
                        }
                        return null;
                    });
                    for (var j = 0, length = unrequestedDisks.length; j < length; j++) {
                        self._diskAllocationPromises[unrequestedDisks[j].path] = diskAllocationPromise;
                    }
                }
            });
        }
    },

    _getDiskLabel: {
        value: function (disk) {
            return this._volumeService.getDiskLabel(disk.name).then(function(label) {
                disk.label = label;
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

    _setVolumeForShare: {
        value: function (share) {
            return this._getContainingVolume(share).then(function (volumeName) {
                share.volume = volumeName;
            });
        }
    },

    _getContainingVolume: {
        value: function (share) {
            if (!this._sharePathDecodePromises[share.filesystem_path]) {
                var self = this;

                this._sharePathDecodePromises[share.filesystem_path] = this._volumeService.decodePath(share.filesystem_path).then(function (decodedPath) {
                    return self._volumesById[decodedPath[0]];
                });
            }

            return this._sharePathDecodePromises[share.filesystem_path];
        }
    }

});
