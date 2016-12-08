var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    StorageRepository = require("core/repository/storage-repository").StorageRepository,
    UserRepository = require("core/repository/user-repository").UserRepository,
    TopologyService = require("core/service/topology-service").TopologyService,
    PeeringService = require("core/service/peering-service").PeeringService,
    FilesystemService = require("core/service/filesystem-service").FilesystemService,
    NotificationCenterModule = require("core/backend/notification-center"),
    Model = require("core/model/model").Model;

exports.StorageSectionService = AbstractSectionService.specialize({
    __volumeServices: {
        value: null
    },

    _volumeServices: {
        get: function() {
            var self = this;
            return this.__volumeServices ?
                Promise.resolve(this.__volumeServices) :
                Model.populateObjectPrototypeForType(Model.Volume).then(function (Volume) {
                    return self.__volumeServices = Volume.services;
                });
        }
    },

    __diskServices: {
        value: null
    },

    _diskServices: {
        get: function() {
            var self = this;
            return this.__diskServices ?
                Promise.resolve(this.__diskServices) :
                Model.populateObjectPrototypeForType(Model.Disk).then(function (Disk) {
                    return self.__diskServices = Disk.services;
                });
        }
    },

    __replicationServices: {
        value: null
    },

    _replicationServices: {
        get: function() {
            var self = this;
            return this.__replicationServices ?
                Promise.resolve(this.__replicationServices) :
                Model.populateObjectPrototypeForType(Model.Replication).then(function (Replication) {
                    return self.__replicationServices = Replication.services;
                });
        }
    },

    SHARE_TYPE: {
        value: Model.Share
    },

    VOLUME_DATASET_TYPE: {
        value: Model.VolumeDataset
    },

    VOLUME_SNAPSHOT_TYPE: {
        value: Model.VolumeSnapshot
    },

    VMWARE_DATASET_TYPE: {
        value: Model.VmwareDataset
    },

    ENCRYPTED_VOLUME_ACTIONS_TYPE: {
        value: Model.EncryptedVolumeActions
    },

    TOPOLOGY_SECTIONS: {
        value: [
            'data',
            'cache',
            'log',
            'spare'
        ]
    },

    init: {
        value: function(storageRepository, topologyService, peeringService, filesystemService, notificationCenter, userRepository) {
            this._rootDatasetPerVolumeId = new Map();
            this._storageRepository = storageRepository || StorageRepository.instance;
            this._userRepository = userRepository || UserRepository.instance;
            this._topologyService = topologyService || TopologyService.instance;
            this._peeringService = peeringService || PeeringService.instance;
            this._filesystemService = filesystemService || FilesystemService.instance;
            this._notificationCenter = notificationCenter || NotificationCenterModule.defaultNotificationCenter;
        }
    },

    loadEntries: {
        value: function() {
            return this._storageRepository.listVolumes();
        }
    },

    loadExtraEntries: {
        value: function() {
            return Promise.all([
                this._storageRepository.getVolumeImporter()
            ]);
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
            return this._datasetsPromise || (this._datasetsPromise = this._storageRepository.listVolumeDatasets().then(function(datasets) {
                self._cacheRootDatasetForVolume();
                return datasets;
            }));
        }
    },

    listVolumeSnapshots: {
        value: function() {
            return this._storageRepository.listVolumeSnapshots();
        }
    },

    listVmwareDatastores: {
        value: function(peer, full) {
            return this._storageRepository.listVmwareDatastores(peer, full);
        }
    },

    listVmwareDatasets: {
        value: function() {
            return this._storageRepository.listVmwareDatasets();
        }
    },

    listPeers: {
        value: function() {
            return this._peeringService.listPeers();
        }
    },

    listUsers: {
        value: function() {
            return this._userRepository.listUsers();
        }
    },

    createVolume: {
        value: function(volume) {
            for (var i = 0, length = this.TOPOLOGY_SECTIONS.length; i < length; i++) {
                this._cleanupTopologySection(volume.topology[this.TOPOLOGY_SECTIONS[i]]);
            }
            volume.type = 'zfs';
            volume._isNew = true;
            var password = volume._password;
            volume.password_encrypted = !!password && password.length > 0;
            volume._password = null;
            if (!volume.key_encrypted) {
                volume.auto_unlock = false;
            }
            return this._storageRepository.saveVolume(volume, password);
        }
    },

    updateVolumeTopology: {
        value: function(volume, topology) {
            for (var i = 0, length = this.TOPOLOGY_SECTIONS.length; i < length; i++) {
                this._cleanupTopologySection(topology[this.TOPOLOGY_SECTIONS[i]]);
            }
            volume._topology = topology;

            // FIXME: Remove once the middleware stops sending erroneous data
            if (!volume.providers_presence) {
                volume.providers_presence = 'NONE';
            }
            return this._storageRepository.saveVolume(volume);
        }
    },

    calculateSizesOnVolume: {
        value: function(volume) {
            volume._paritySize = this._getParitySizeOfVolume(volume);
        }
    },

    setRootDatasetForVolume: {
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
            }).then(function(rootDataset) {
                volume._rootDataset = rootDataset;
            });
        }
    },

    listDetachedVolumes: {
        value: function() {
            return this._storageRepository.listDetachedVolumes();
        }
    },

    importDisk: {
        value: function(disk, path, fstype) {
            var self = this;
            return this._volumeServices.then(function(volumeServices) {
                return volumeServices.importDisk(disk, path, fstype);
            });
        }
    },
    importDetachedVolume: {
        value: function(detachedVolume) {
            var self = this;
            return this._volumeServices.then(function(volumeServices) {
                return volumeServices.import(detachedVolume.id, detachedVolume.name);
            }).then(function() {
                self._storageRepository.listDetachedVolumes();
            });
        }
    },

    deleteDetachedVolume: {
        value: function(detachedVolume) {
            var self = this;
            return this._volumeServices.then(function(volumeServices) {
                return volumeServices.deleteExported(detachedVolume.name);
            }).then(function() {
                self._storageRepository.listDetachedVolumes();
            });
        }
    },

    exportVolume: {
        value: function(volume) {
            return this._volumeServices.then(function(volumeServices) {
                return volumeServices.export(volume.id);
            });
        }
    },

    getEncryptedVolumeImporterInstance: {
        value: function() {
            return this._storageRepository.getEncryptedVolumeImporterInstance();
        }
    },

    getEncryptedVolumeActionsForVolume: {
        value: function (volume) {
            return this._storageRepository.getEncryptedVolumeActionsInstance().then(function (encryptedVolumeActions) {
                encryptedVolumeActions.volume = volume;
                return encryptedVolumeActions;
            })
        }
    },

    importEncryptedVolume: {
        value: function(encryptedVolumeImporter) {
            return this._volumeServices.then(function(volumeServices) {
                return volumeServices.import(
                    encryptedVolumeImporter.name,
                    encryptedVolumeImporter.name,
                    {},
                    {
                        key: encryptedVolumeImporter.key,
                        disks: encryptedVolumeImporter.disks.map(function(x) { return x.path; })
                    },
                    encryptedVolumeImporter.password
                );
            });
        }
    },

    scrubVolume: {
        value: function(volume) {
            return this._volumeServices.then(function(volumeServices) {
                return volumeServices.scrub(volume.id);
            });
        }
    },

    listImportableDisks: {
        value: function() {
            return this._storageRepository.listImportableDisks();
        }
    },

    listDisks: {
        value: function() {
            return this._storageRepository.listDisks();
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

    eraseDisk: {
        value: function(diskId) {
            return this._diskServices.then(function(diskService) {
                return diskService.erase(diskId);
            });
        }
    },

    clearTemporaryAvailableDisks: {
        value: function() {
            return this._storageRepository.clearTemporaryAvailableDisks();
        }
    },

    generateTopology: {
        value: function(topology, disks, redundancy, speed, storage) {
            var self = this;
            return this.clearReservedDisks(true).then(function() {
                var vdev, j, disksLength,
                    priorities = self._topologyService.generateTopology(topology, disks.slice(), redundancy, speed, storage),
                    usedDisks = [];
                for (var i = 0, vdevsLength = topology.data.length; i < vdevsLength; i++) {
                    vdev = topology.data[i];
                    if (Array.isArray(vdev.children)) {
                        for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                            self.markDiskAsReserved(vdev.children[j]);
                            usedDisks.push(vdev.children[j]);
                        }
                    } else {
                        self.markDiskAsReserved(vdev);
                        usedDisks.push(vdev);
                    }
                }
                return {
                    priorities: priorities
                };
            });
        }
    },

    lockVolume: {
        value: function(volume) {
            return volume.services.lock(volume.id);
        }
    },

    unlockVolume: {
        value: function(volume, password) {
            return volume.services.unlock(volume.id, password);
        }
    },

    rekeyVolume: {
        value: function(volume, isKeyEncrypted, password) {
            return volume.services.rekey(volume.id, isKeyEncrypted, password);
        }
    },

    getVolumeKey: {
        value: function(volume) {
            var self = this;
            return Model.populateObjectPrototypeForType(Model.Task).then(function (Task) {
                return Task.constructor.services.submitWithDownload("volume.keys.backup",  [volume.id, "key_" + volume.id]);
            }).then(function(response) {
                var taskId = response[0],
                    taskPromise = new Promise(function(resolve) {
                        self._notificationCenter.addEventListener("taskDone", function(event) {
                            if (event.detail && event.detail.jobId === taskId) {
                                resolve(event.detail.taskReport.result);
                            }
                        });
                    });

                return {
                    link: response[1][0],
                    taskPromise: taskPromise
                };
            });
        }
    },

    setVolumeKey: {
        value: function(volume, keyFile, password) {
            return this._filesystemService.submitTaskWithUpload(keyFile, "task.submit_with_upload", ["volume.keys.restore", [volume.id, null, password]]);
        }
    },

    replicateDataset: {
        value: function(dataset, replicationOptions, transportOptions) {
            return this._replicationServices.then(function(services) {
                return services.replicateDataset(dataset, replicationOptions, transportOptions, false);
            });
        }
    },

    getReplicationOptionsInstance: {
        value: function() {
            return this._storageRepository.getReplicationOptionsInstance();
        }
    },

    _cleanupTopologySection: {
        value: function(topologySection) {
            var i, vdevsLength, vdev,
                j, disksLength, disk, path;
            for (i = 0, vdevsLength = topologySection.length; i < vdevsLength; i++) {
                vdev = topologySection[i];
                if (vdev.children) {
                    for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                        disk = vdev.children[j];
                        path = disk.path;
                        if (path.indexOf('/dev/') != 0) {
                            path = '/dev/' + path;
                        }
                        vdev.children[j].path = path;
                        vdev.children[j].type = 'disk';
                    }
                    if (vdev.children.length == 1) {
                        vdev.path = vdev.children[0].path;
                        vdev.children = [];
                    }
                }
            }
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
