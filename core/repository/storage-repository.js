var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VolumeDao = require("core/dao/volume-dao").VolumeDao,
    VolumeDatasetDao = require("core/dao/volume-dataset-dao").VolumeDatasetDao,
    VolumeSnapshotDao = require("core/dao/volume-snapshot-dao").VolumeSnapshotDao,
    DiskDao = require("core/dao/disk-dao").DiskDao,
    ShareDao = require("core/dao/share-dao").ShareDao,
    VolumeImporterDao = require("core/dao/volume-importer-dao").VolumeImporterDao,
    DetachedVolumeDao = require("core/dao/detached-volume-dao").DetachedVolumeDao,
    Model = require("core/model/model").Model;

exports.StorageRepository = AbstractRepository.specialize({
    __volumeServices: {
        value: null
    },

    _volumeServices: {
        get: function() {
            var self = this;
            return this.__volumeServices ?
                Promise.resolve(this.__volumeServices) : 
                Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                    return self.__volumeServices = Volume.constructor.services;
                });
        }
    },

    init: {
        value: function(volumeDao, shareDao, volumeDatasetDao, volumeSnapshotDao, diskDao, volumeImporterDao, detachedVolumeDao) {
            this._volumeDao = volumeDao || VolumeDao.instance;
            this._shareDao = shareDao || ShareDao.instance;
            this._volumeDatasetDao = volumeDatasetDao || VolumeDatasetDao.instance;
            this._volumeSnapshotDao = volumeSnapshotDao || VolumeSnapshotDao.instance;
            this._diskDao = diskDao || DiskDao.instance;
            this._volumeImporterDao = volumeImporterDao || VolumeImporterDao.instance;
            this._detachedVolumeDao = detachedVolumeDao || DetachedVolumeDao.instance;

            this._availableDisks = [];
            this._reservedDisks = new Set();
            this._temporarilyAvailableDisks = new Set();
            this.addRangeAtPathChangeListener("_volumes", this, "_handleDiskAssignationChange");
            this.addRangeAtPathChangeListener("_disks", this, "_handleDiskAssignationChange");
        }
    },

    getStorageOverview: {
        value: function() {
            var self = this;
            this._storageOverview = {};
            return Promise.all([
                this.listVolumes()
            ]).then(function(results) {
                self._storageOverview.volumes = results[0];
                return self._storageOverview;
            });

        }
    },

    listVolumes: {
        value: function() {
            var self = this,
                promise;
            return this._volumesPromise || 
                (this._volumesPromise = this._volumeDao.list().then(function(volumes) {
                    return self._volumes = volumes;
                }));
        }
    },

    listShares: {
        value: function() {
            return this._shareDao.list();
        }
    },

    listVolumeSnapshots: {
        value: function() {
            return this._volumeSnapshotDao.list();
        }
    },

    listVolumeDatasets: {
        value: function() {
            return this._volumeDatasetDao.list();
        }
    },

    listDetachedVolumes: {
        value: function() {
            return this._detachedVolumeDao.list();
        }
    },

    listDisks: {
        value: function() {
            var self = this;
            return this._disksPromise = this._diskDao.list().then(function(disks) {
                return self._disks = disks;
            });
        }
    },

    listAvailableDisks: {
        value: function() {
            return this._availableDisks ?
                    Promise.resolve(this._availableDisks) : 
                    this.refreshAvailableDisks();
        }
    },

    markDiskAsReserved: {
        value: function(disk, isRefreshBlocked) {
            disk = disk.Type === Model.ZfsVdev ? disk._disk : disk;
            this._reservedDisks.add(disk);

            return isRefreshBlocked ? Promise.resolve() : this._handleDiskAssignationChange();
        }
    },

    markDiskAsAvailable: {
        value: function(disk, isTransient) {
            disk = disk.Type === Model.ZfsVdev ? disk._disk : disk;
            this._reservedDisks.delete(disk);
            if (isTransient && this._knownAvailableDisks.indexOf(disk.path) === -1) {
                this._temporarilyAvailableDisks.add(disk);
            }
            return this._handleDiskAssignationChange();
        }
    },

    clearReservedDisks: {
        value: function() {
            this._reservedDisks.clear();    
            this._temporarilyAvailableDisks.clear();

            return this._handleDiskAssignationChange();
        }
    },

    getVolumeImporter: {
        value: function() {
            return this._volumeImporterPromise || (this._volumeImporterPromise = this._volumeImporterDao.getNewInstance().then(function(volumeImporter) {
                volumeImporter._isNew = false;
                volumeImporter.id = '';
                volumeImporter.name = "Import volumes";
                return volumeImporter;
            }));
        }
    },

    refreshAvailableDisks: {
        value: function(isRefreshBlocked) {
            var self = this,
                disksPromise = this._disksPromise || this.listDisks();
            return Promise.all([
                this._listKnownAvailableDisks(!isRefreshBlocked),
                disksPromise
            ]).then(function(results) {
                var availablePaths = results[0],
                    disks = results[1],
                    availableDisks = disks.filter(function(disk) { return availablePaths.indexOf(disk.path) != -1 }).sort(availableDisksSorter),
                    disk;
                self._availableDisks.clear();
                for (var i = 0, length = availableDisks.length; i < length; i++) {
                    disk = availableDisks[i];
                    if (!self._reservedDisks.has(disk)) {
                        self._availableDisks.push(disk);
                    }
                }
                self._temporarilyAvailableDisks.forEach(function(disk) {
                    self._availableDisks.push(disk);
                });
                self._updateAvailableDisksPromise = null;
                return self._availableDisks;
            });
        }
    },

    _handleDiskAssignationChange: {
        value: function() {
            var promise;
            if (this._updateAvailableDisksPromise) {
                var self = this;
                promise = this._updateAvailableDisksPromise.then(function() {
                    self._updateAvailableDisksPromise = self.refreshAvailableDisks();
                });
            } else {
                promise = this._updateAvailableDisksPromise = this.refreshAvailableDisks();
            }
            return promise;
        }
    },

    _listKnownAvailableDisks: {
        value: function(isRefreshNeeded) {
            var self = this,
                promise;
            if (isRefreshNeeded || !this._knownAvailableDisks || this._knownAvailableDisks.length === 0) {
                promise = this._volumeServices.then(function(volumeServices) {
                    return volumeServices.getAvailableDisks();
                }).then(function(availableDisks) {
                    return self._knownAvailableDisks = availableDisks;
                });
            } else {
                promise = Promise.resolve(this._knownAvailableDisks);
            }
            return promise;
        }
    }
});

function availableDisksSorter(a, b) {
    return a.status.is_ssd ? 
                b.status.is_ssd ?
                    a.name > b.name ? 1 : -1 :
                    1 :
                -1;
}
