var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    StorageRepository = require("core/repository/storage-repository").StorageRepository,
    TopologyService = require("core/service/topology-service").TopologyService,
    Model = require("core/model/model").Model;

exports.StorageSectionService = AbstractSectionService.specialize({
    SHARE_TYPE: {
        value: Model.Share
    },

    VOLUME_DATASET_TYPE: {
        value: Model.VolumeDataset
    },

    VOLUME_SNAPSHOT_TYPE: {
        value: Model.VolumeSnapshot
    },

    init: {
        value: function(storageRepository, topologyService) {
            this._rootDatasetPerVolumeId = new Map();
            this._storageRepository = storageRepository || StorageRepository.instance;
            this._topologyService = topologyService || TopologyService.instance;
        }
    },

    loadEntries: {
        value: function() {
            return Promise.all([
                this._storageRepository.listVolumes(),
                this._storageRepository.getVolumeImporter()
            ]).then(function(results) {
                results[0].push(results[1]);
                return results[0];
            });
        }
    },

    loadOverview: {
        value: function() {
            return this._storageRepository.getStorageOverview();
        }
    },

    loadSettings: {
        value: function() {
        }
    },

    listShares: {
        value: function() {
            return this._storageRepository.listShares();
        }
    },

    listVolumeDatasets: {
        value: function() {
            var self = this,
                dataset;
            return this._datasetsPromise = this._storageRepository.listVolumeDatasets().then(function(datasets) {
                self._cacheRootDatasetForVolume();
                return datasets;
            });
        }
    },

    listVolumeSnapshots: {
        value: function() {
            return this._storageRepository.listVolumeSnapshots();
        }
    },

    calculateSizesOnVolume: {
        value: function(volume) {
            volume._paritySize = this._getParitySizeOfVolume(volume);
        }
    },

    getRootDatasetForVolume: {
        value: function(volume) {
            var self = this,
                promise;
            if (!this._rootDatasetPerVolumeId.has(volume.id)) {
                promise = this._cacheRootDatasetForVolume(volume);
            } else {
                promise = Promise.resolve();
            }
            return promise.then(function() {
                return self._rootDatasetPerVolumeId.get(volume.id);
            });
        }
    },

    listDetachedVolumes: {
        value: function() {
            return this._storageRepository.listDetachedVolumes();
        }
    },

    listAvailableDisks: {
        value: function() {
            return this._storageRepository.listAvailableDisks();
        }
    },

    markDiskAsReserved: {
        value: function(disk, isRefreshBlocked) {
            return this._storageRepository.markDiskAsReserved(disk, isRefreshBlocked);
        }
    },

    markDiskAsAvailable: {
        value: function(disk, isTransient) {
            return this._storageRepository.markDiskAsAvailable(disk, isTransient);
        }
    },

    clearReservedDisks: {
        value: function(isRefreshBlocked) {
            return this._storageRepository.clearReservedDisks(isRefreshBlocked);
        }
    },

    generateTopology: {
        value: function(topology, disks, redundancy, speed, storage) {
            var self = this;
            return this.clearReservedDisks().then(function() {
                var vdev, j, disksLength,
                    priorities = self._topologyService.generateTopology(topology, disks, redundancy, speed, storage);
                for (var i = 0, vdevsLength = topology.data.length; i < vdevsLength; i++) {
                    vdev = topology.data[i];
                    if (Array.isArray(vdev.children)) {
                        for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                            self.markDiskAsReserved(vdev.children[j], true);
                        }
                    } else {
                        self.markDiskAsReserved(vdev, true);
                    }
                }
                return self._storageRepository.refreshAvailableDisks(true).then(function() {
                    return priorities;
                }); 
            });
        }
    },

    _cacheRootDatasets: {
        value: function() {
            return this._cacheRootDatasetForVolume();
        }
    },

    _cacheRootDatasetForVolume: {
        value: function(volume) {
            var self = this,
                promise = this._datasetsPromise || this.listVolumeDatasets();
            return promise.then(function(datasets) {
                for (var i = 0, length = datasets.length; i < length; i++) {
                    dataset = datasets[i];
                    if (dataset.id === dataset.volume) {
                        self._rootDatasetPerVolumeId.set(dataset.volume, dataset);
                        if (volume && dataset.volume === volume.id) {
                            break;
                        }
                    }
                }
            });
        }
    },

    _getParitySizeOfVolume: {
        value: function(volume) {
            if (volume && volume.topology) {
                var vdevs = volume.topology.data,
                    vdev, i, length,
                    paritySize = 0;
                for (i = 0, length = vdevs.length; i < length; i++) {
                    vdev = vdevs[i];
                    if (vdev.children) {
                        paritySize += this._topologyService.getParitySizeOnAllocated(vdev.children.length, vdev.type, vdev.stats.allocated);
                    }
                }
                return paritySize;
            }
        }
    }

});

