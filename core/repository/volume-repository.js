"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var volume_dao_1 = require("../dao/volume-dao");
var volume_snapshot_dao_1 = require("../dao/volume-snapshot-dao");
var volume_dataset_dao_1 = require("../dao/volume-dataset-dao");
var volume_importer_dao_1 = require("../dao/volume-importer-dao");
var encrypted_volume_actions_dao_1 = require("../dao/encrypted-volume-actions-dao");
var volume_vdev_recommendations_dao_1 = require("../dao/volume-vdev-recommendations-dao");
var detached_volume_dao_1 = require("../dao/detached-volume-dao");
var encrypted_volume_importer_dao_1 = require("../dao/encrypted-volume-importer-dao");
var zfs_topology_dao_1 = require("../dao/zfs-topology-dao");
var model_event_name_1 = require("../model-event-name");
var VolumeRepository = (function (_super) {
    __extends(VolumeRepository, _super);
    function VolumeRepository(volumeDao, volumeSnapshotDao, volumeDatasetDao, volumeImporterDao, encryptedVolumeActionsDao, volumeVdevRecommendationsDao, detachedVolumeDao, encryptedVolumeImporterDao, zfsTopologyDao) {
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
        _this.detachedVolumeDao = detachedVolumeDao;
        _this.encryptedVolumeImporterDao = encryptedVolumeImporterDao;
        _this.zfsTopologyDao = zfsTopologyDao;
        return _this;
    }
    VolumeRepository.getInstance = function () {
        if (!VolumeRepository.instance) {
            VolumeRepository.instance = new VolumeRepository(new volume_dao_1.VolumeDao(), new volume_snapshot_dao_1.VolumeSnapshotDao(), new volume_dataset_dao_1.VolumeDatasetDao(), new volume_importer_dao_1.VolumeImporterDao(), new encrypted_volume_actions_dao_1.EncryptedVolumeActionsDao(), new volume_vdev_recommendations_dao_1.VolumeVdevRecommendationsDao(), new detached_volume_dao_1.DetachedVolumeDao(), new encrypted_volume_importer_dao_1.EncryptedVolumeImporterDao(), new zfs_topology_dao_1.ZfsTopologyDao());
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
    VolumeRepository.prototype.createVolume = function (volume, password) {
        volume.topology = this.cleanupTopology(volume.topology);
        return this.volumeDao.save(volume, [password]);
    };
    VolumeRepository.prototype.scrubVolume = function (volume) {
        return this.volumeDao.scrub(volume);
    };
    VolumeRepository.prototype.listDetachedVolumes = function () {
        return this.detachedVolumeDao.list();
    };
    VolumeRepository.prototype.importDetachedVolume = function (volume) {
        return this.detachedVolumeDao.import(volume);
    };
    VolumeRepository.prototype.deleteDetachedVolume = function (volume) {
        return this.detachedVolumeDao.delete(volume);
    };
    VolumeRepository.prototype.exportVolume = function (volume) {
        return this.volumeDao.export(volume);
    };
    VolumeRepository.prototype.lockVolume = function (volume) {
        return this.volumeDao.lock(volume);
    };
    VolumeRepository.prototype.unlockVolume = function (volume, password) {
        return this.volumeDao.unlock(volume, password);
    };
    VolumeRepository.prototype.rekeyVolume = function (volume, key, password) {
        return this.volumeDao.rekey(volume, key, password);
    };
    VolumeRepository.prototype.getVolumeKey = function (volume) {
        return this.volumeDao.getVolumeKey(volume);
    };
    VolumeRepository.prototype.importEncryptedVolume = function (name, disks, key, password) {
        return this.volumeDao.importEncrypted(name, disks, key, password);
    };
    VolumeRepository.prototype.getEncryptedVolumeImporterInstance = function () {
        return this.encryptedVolumeImporterDao.getNewInstance();
    };
    VolumeRepository.prototype.getTopologyInstance = function () {
        return this.zfsTopologyDao.getNewInstance().then(function (zfsTopology) {
            for (var _i = 0, _a = VolumeRepository.TOPOLOGY_KEYS; _i < _a.length; _i++) {
                var key = _a[_i];
                zfsTopology[key] = [];
            }
            return zfsTopology;
        });
    };
    VolumeRepository.prototype.clearTopology = function (topology) {
        for (var _i = 0, _a = VolumeRepository.TOPOLOGY_KEYS; _i < _a.length; _i++) {
            var key = _a[_i];
            topology[key] = [];
        }
        return topology;
    };
    VolumeRepository.prototype.listImportableDisks = function () {
        return this.volumeDao.findMedia();
    };
    VolumeRepository.prototype.importDisk = function (disk, path, fsType) {
        return this.volumeDao.importDisk(disk, path, fsType);
    };
    VolumeRepository.prototype.cleanupTopology = function (topology) {
        var clean = {};
        for (var _i = 0, _a = VolumeRepository.TOPOLOGY_KEYS; _i < _a.length; _i++) {
            var key = _a[_i];
            if (topology[key] && topology[key].length > 0) {
                var part = [];
                for (var _b = 0, _c = topology[key]; _b < _c.length; _b++) {
                    var vdev = _c[_b];
                    part.push(this.cleanupVdev(vdev));
                }
                clean[key] = part;
            }
        }
        return clean;
    };
    VolumeRepository.prototype.cleanupVdev = function (vdev) {
        var clean;
        if (vdev.type === 'disk') {
            clean = {
                type: 'disk'
            };
            if (!vdev.path && vdev.children && vdev.children.length === 1) {
                clean.path = vdev.children[0].path;
            }
            else if (vdev.path) {
                clean.path = vdev.path;
            }
        }
        else {
            clean = {
                type: vdev.type,
                children: []
            };
            for (var _i = 0, _a = vdev.children; _i < _a.length; _i++) {
                var child = _a[_i];
                clean.children.push(this.cleanupVdev(child));
            }
        }
        return clean;
    };
    VolumeRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'Volume':
                var self_1 = this, hasTopologyChanged_1 = false, volumeId_1;
                if (this.volumes) {
                    this.volumes.forEach(function (volume) {
                        volumeId_1 = volume.get('id');
                        if (!state.has(volumeId_1) || volume.get('topology') !== state.get(volumeId_1).get('topology')) {
                            hasTopologyChanged_1 = true;
                        }
                    });
                    if (!hasTopologyChanged_1) {
                        state.forEach(function (volume) {
                            volumeId_1 = volume.get('id');
                            if (!self_1.volumes.has(volumeId_1) || volume.get('topology') !== self_1.volumes.get(volumeId_1).get('topology')) {
                                hasTopologyChanged_1 = true;
                            }
                        });
                    }
                }
                else {
                    hasTopologyChanged_1 = true;
                }
                if (hasTopologyChanged_1) {
                    this.eventDispatcherService.dispatch('topologyChange');
                }
                this.volumes = this.dispatchModelEvents(this.volumes, model_event_name_1.ModelEventName.Volume, state);
                break;
            case 'VolumeSnapshot':
                this.volumeSnapshots = this.dispatchModelEvents(this.volumeSnapshots, model_event_name_1.ModelEventName.VolumeSnapshot, state);
                break;
            case 'VolumeDataset':
                this.volumeDatasets = this.dispatchModelEvents(this.volumeDatasets, model_event_name_1.ModelEventName.VolumeDataset, state);
                break;
            default:
                break;
        }
    };
    VolumeRepository.prototype.handleEvent = function () { };
    return VolumeRepository;
}(abstract_repository_ng_1.AbstractRepository));
VolumeRepository.TOPOLOGY_KEYS = ["data", "cache", "log", "spare"];
exports.VolumeRepository = VolumeRepository;
