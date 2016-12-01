"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var volume_dao_1 = require("core/dao/volume-dao");
var volume_snapshot_dao_1 = require("core/dao/volume-snapshot-dao");
var volume_dataset_dao_1 = require("core/dao/volume-dataset-dao");
var volume_importer_dao_1 = require("core/dao/volume-importer-dao");
var encrypted_volume_actions_dao_1 = require("core/dao/encrypted-volume-actions-dao");
var volume_vdev_recommendations_dao_1 = require("../dao/volume-vdev-recommendations-dao");
var VolumeRepository = (function (_super) {
    __extends(VolumeRepository, _super);
    function VolumeRepository(volumeDao, volumeSnapshotDao, volumeDatasetDao, volumeImporterDao, encryptedVolumeActionsDao, volumeVdevRecommendationsDao) {
        var _this = _super.call(this, [
            'Volume',
            'VolumeDataset',
            'VolumeSnapshot'
        ]) || this;
        _this.volumeDao = volumeDao;
        _this.volumeSnapshotDao = volumeSnapshotDao;
        _this.volumeDatasetDao = volumeDatasetDao;
        _this.volumeImporterDao = volumeImporterDao;
        _this.encryptedVolumeActionsDao = encryptedVolumeActionsDao;
        _this.volumeVdevRecommendationsDao = volumeVdevRecommendationsDao;
        return _this;
    }
    VolumeRepository.getInstance = function () {
        if (!VolumeRepository.instance) {
            VolumeRepository.instance = new VolumeRepository(volume_dao_1.VolumeDao.getInstance(), volume_snapshot_dao_1.VolumeSnapshotDao.getInstance(), volume_dataset_dao_1.VolumeDatasetDao.getInstance(), volume_importer_dao_1.VolumeImporterDao.getInstance(), encrypted_volume_actions_dao_1.EncryptedVolumeActionsDao.getInstance(), volume_vdev_recommendations_dao_1.VolumeVdevRecommendationsDao.getInstance());
        }
        return VolumeRepository.instance;
    };
    VolumeRepository.prototype.listVolumes = function () {
        return this.volumeDao.list();
    };
    VolumeRepository.prototype.listDatasets = function () {
        return this.volumeDatasetDao.list();
    };
    VolumeRepository.prototype.listSnapshots = function () {
        return this.volumeSnapshotDao.list();
    };
    VolumeRepository.prototype.getVolumeImporter = function () {
        return this.volumeImporterDao.getNewInstance().then(function (volumeImporter) {
            volumeImporter._isNew = false;
            return volumeImporter;
        });
    };
    VolumeRepository.prototype.getEncryptedVolumeActionsInstance = function () {
        return this.encryptedVolumeActionsDao.getNewInstance();
    };
    VolumeRepository.prototype.getDisksAllocations = function (diskIds) {
        return this.volumeDao.getDisksAllocation(diskIds);
    };
    VolumeRepository.prototype.getAvailableDisks = function () {
        return this.volumeDao.getAvailableDisks();
    };
    VolumeRepository.prototype.getVdevRecommendations = function () {
        return this.volumeVdevRecommendationsDao.get();
    };
    VolumeRepository.prototype.createVolume = function (volume) {
        return this.volumeDao.save(volume);
    };
    VolumeRepository.prototype.handleStateChange = function (name, state) {
        var self = this;
        switch (name) {
            case 'Volume':
                this.eventDispatcherService.dispatch('volumesChange', state);
                state.forEach(function (volume, id) {
                    if (!self.volumes || !self.volumes.has(id)) {
                        self.eventDispatcherService.dispatch('volumeAdd.' + id, volume);
                    }
                    else if (self.volumes.get(id) !== volume) {
                        self.eventDispatcherService.dispatch('volumeChange.' + id, volume);
                    }
                });
                if (this.volumes) {
                    this.volumes.forEach(function (volume, id) {
                        if (!state.has(id) || state.get(id) !== volume) {
                            self.eventDispatcherService.dispatch('volumeRemove.' + id, volume);
                        }
                    });
                }
                this.volumes = state;
                break;
            case 'VolumeSnapshot':
                this.eventDispatcherService.dispatch('volumeSnapshotsChange', state);
                state.forEach(function (volumeSnapshot, id) {
                    if (!self.volumeSnapshots || !self.volumeSnapshots.has(id)) {
                        self.eventDispatcherService.dispatch('volumeSnapshotAdd.' + id, volumeSnapshot);
                    }
                    else if (self.volumeSnapshots.get(id) !== volumeSnapshot) {
                        self.eventDispatcherService.dispatch('volumeSnapshotChange.' + id, volumeSnapshot);
                    }
                });
                if (this.volumeSnapshots) {
                    this.volumeSnapshots.forEach(function (volumeSnapshot, id) {
                        if (!state.has(id) || state.get(id) !== volumeSnapshot) {
                            self.eventDispatcherService.dispatch('volumeSnapshotRemove.' + id, volumeSnapshot);
                        }
                    });
                }
                this.volumeSnapshots = state;
                break;
            case 'VolumeDataset':
                this.eventDispatcherService.dispatch('volumeDatasetsChange', state);
                state.forEach(function (volumeDataset, id) {
                    if (!self.volumeDatasets || !self.volumeDatasets.has(id)) {
                        self.eventDispatcherService.dispatch('volumeDatasetAdd.' + id, volumeDataset);
                    }
                    else if (self.volumeDatasets.get(id) !== volumeDataset) {
                        self.eventDispatcherService.dispatch('volumeDatasetChange.' + id, volumeDataset);
                    }
                });
                if (this.volumeDatasets) {
                    this.volumeDatasets.forEach(function (volumeDataset, id) {
                        if (!state.has(id) || state.get(id) !== volumeDataset) {
                            self.eventDispatcherService.dispatch('volumeDatasetRemove.' + id, volumeDataset);
                        }
                    });
                }
                this.volumeDatasets = state;
                break;
            default:
                break;
        }
    };
    VolumeRepository.prototype.handleEvent = function () { };
    return VolumeRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.VolumeRepository = VolumeRepository;
