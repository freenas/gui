var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    VolumeDao = require("core/dao/volume-dao").VolumeDao,
    VolumeDatasetDao = require("core/dao/volume-dataset-dao").VolumeDatasetDao,
    VolumeSnapshotDao = require("core/dao/volume-snapshot-dao").VolumeSnapshotDao,
    DiskDao = require("core/dao/disk-dao").DiskDao,
    ShareDao = require("core/dao/share-dao").ShareDao,
    VolumeImporterDao = require("core/dao/volume-importer-dao").VolumeImporterDao,
    EncryptedVolumeImporterDao = require("core/dao/encrypted-volume-importer-dao").EncryptedVolumeImporterDao,
    DetachedVolumeDao = require("core/dao/detached-volume-dao").DetachedVolumeDao,
    ImportableDiskDao = require("core/dao/importable-disk-dao").ImportableDiskDao,
    VmwareDatasetDao = require("core/dao/vmware-dataset-dao").VmwareDatasetDao,
    VmwareDatastoreDao = require("core/dao/vmware-datastore-dao").VmwareDatastoreDao,
    DisksAllocationType = require("core/model/enumerations/disks-allocation-type").DisksAllocationType,
    EncryptedVolumeActionsDao = require("core/dao/encrypted-volume-actions-dao").EncryptedVolumeActionsDao,
    BackEndBridgeModule = require("../backend/backend-bridge"),
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
        value: function(volumeDao, shareDao, volumeDatasetDao, volumeSnapshotDao, diskDao, volumeImporterDao, encryptedVolumeImporterDao, detachedVolumeDao, importableDiskDao, vmwareDatasetDao, vmwareDatastoreDao, encryptedVolumeActionsDao, backendBridge) {
            this._volumeDao = volumeDao || VolumeDao.instance;
            this._shareDao = shareDao || ShareDao.instance;
            this._volumeDatasetDao = volumeDatasetDao || VolumeDatasetDao.instance;
            this._volumeSnapshotDao = volumeSnapshotDao || VolumeSnapshotDao.instance;
            this._diskDao = diskDao || DiskDao.instance;
            this._volumeImporterDao = volumeImporterDao || VolumeImporterDao.instance;
            this._encryptedVolumeImporterDao = encryptedVolumeImporterDao || EncryptedVolumeImporterDao.instance;
            this._detachedVolumeDao = detachedVolumeDao || DetachedVolumeDao.instance;
            this._importableDiskDao = importableDiskDao || ImportableDiskDao.instance;
            this._vmwareDatasetDao = vmwareDatasetDao || VmwareDatasetDao.instance;
            this._vmwareDatastoreDao = vmwareDatastoreDao || VmwareDatastoreDao.instance;
            this._encryptedVolumeActionsDao = encryptedVolumeActionsDao || EncryptedVolumeActionsDao.instance;
            this._backendBridge = backendBridge || BackEndBridgeModule.defaultBackendBridge;

            this._availableDisks = [];
            this._detachedVolumes = [];
            this._importableDisks = [];
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

    saveVolume: {
        value: function(volume, password) {
            return this._volumeDao.save(volume, password);
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

    listVmwareDatasets: {
        value: function() {
            return this._vmwareDatasetDao.list();
        }
    },

    listVmwareDatastores: {
        value: function(peer, full) {
            return this._vmwareDatastoreDao.list(peer, full);
        }
    },

    listDetachedVolumes: {
        value: function() {
            var self = this;
            this._detachedVolumes.clear();
            return this._detachedVolumeDao.list().then(function(detachedVolumes) {
                return Promise.all(
                    detachedVolumes.map(function(detachedVolume) { return detachedVolume.topology; })
                ).then(function() {
                    var detachedVolume;
                    for (var i = 0, length = detachedVolumes.length; i < length; i++) {
                        detachedVolume = detachedVolumes[i];
                        detachedVolume.topology._isDetached = true;
                        self._detachedVolumes.push(detachedVolume);
                    }
                    return self._detachedVolumes;
                });
            });
        }
    },

    listImportableDisks: {
        value: function() {
            var self = this;
            this._importableDisks.clear();
            return this._importableDiskDao.list().then(function(importableDisks) {
                return this._importableDisks = importableDisks;
            });
        }
    },

    listDisks: {
        value: function() {
            var self = this;
            return this._disksPromise = this._diskDao.list().then(function(disks) {
                return self.getDiskAllocations(disks).then(function(disks) {
                    return self._disks = disks;
                });
            });
        }
    },

    getDiskAllocations: {
        value: function(disks) {
            var self = this;
            return this._backendBridge.send("rpc", "call", {
                method: "volume.get_disks_allocation",
                args: [disks.map(function(x) {
                    return x.path})]
            }).then(function(response) {
                return disks.map(function(x) {
                    x._allocation = response.data[x.path];
                    return x;
                });
            });
        }
    },

    listAvailableDisks: {
        value: function(forceRefresh) {
            if (forceRefresh) {
                this._availableDisksPromise = null;
            }
            return this._availableDisksPromise || (this._availableDisksPromise = this._filterAvailableDisks())
        }
    },

    clearReservedDisks: {
        value: function() {
            this._disks.map(function(x) {
                x.isReserved = false;
            });
            return this.listAvailableDisks(true);
        }
    },

    clearTemporaryAvailableDisks: {
        value: function() {
            this._disks.map(function(x) {
                x.isTemporaryAvailable = false;
            });
        }
    },

    markDiskAsReserved: {
        value: function(disk) {
            disk = disk._disk || disk;
            disk.isReserved = true;
        }
    },

    markDiskAsAvailable: {
        value: function(disk) {
            disk = disk._disk || disk;
            if (!disk.isAvailable) {
                disk.isTemporaryAvailable = true;
            }
            disk.isReserved = false;
        }
    },

    _filterAvailableDisks: {
        value: function() {
            var self = this;
            return this._volumeServices.then(function(volumeServices) {
                return Promise.all([
                    volumeServices.getAvailableDisks(),
                    self.listDisks()
                ]);
            }).then(function(results) {
                var availableDisks = results[0],
                    disks = results[1];
                return disks.map(function(x) {
                    x.isReserved = false;
                    x.isAvailable = availableDisks.indexOf(x.path) !== -1
                    return x;
                }).filter(function(x) {
                    return x.isAvailable;
                });
            });
        }
    },

    _handleDiskAssignationChange: {
        value: function() {
            this.listAvailableDisks(true);
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

    getEncryptedVolumeImporterInstance: {
        value: function() {
            return this._encryptedVolumeImporterDao.getNewInstance().then(function(encryptedVolumeImporter) {
                encryptedVolumeImporter.data = [];
                return encryptedVolumeImporter;
            });
        }
    },

    getEncryptedVolumeActionsInstance: {
        value: function () {
            return this._encryptedVolumeActionsDao.getNewInstance();
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
