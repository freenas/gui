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
var model_1 = require("../model");
var zfs_vdev_dao_1 = require("../dao/zfs-vdev-dao");
var datastore_service_1 = require("../service/datastore-service");
var volume_dataset_properties_dao_1 = require("../dao/volume-dataset-properties-dao");
var volume_dataset_property_atime_dao_1 = require("../dao/volume-dataset-property-atime-dao");
var volume_dataset_property_casesensitivity_dao_1 = require("../dao/volume-dataset-property-casesensitivity-dao");
var volume_dataset_property_compression_dao_1 = require("../dao/volume-dataset-property-compression-dao");
var volume_dataset_property_dedup_dao_1 = require("../dao/volume-dataset-property-dedup-dao");
var volume_dataset_property_quota_dao_1 = require("../dao/volume-dataset-property-quota-dao");
var volume_dataset_property_refquota_dao_1 = require("../dao/volume-dataset-property-refquota-dao");
var volume_dataset_property_volblocksize_dao_1 = require("../dao/volume-dataset-property-volblocksize-dao");
var volume_dataset_property_refreservation_dao_1 = require("../dao/volume-dataset-property-refreservation-dao");
var volume_dataset_property_reservation_dao_1 = require("../dao/volume-dataset-property-reservation-dao");
var Promise = require("bluebird");
var bytes = require("bytes");
var _ = require("lodash");
var permissions_dao_1 = require("../dao/permissions-dao");
var VolumeRepository = (function (_super) {
    __extends(VolumeRepository, _super);
    function VolumeRepository(volumeDao, volumeSnapshotDao, volumeDatasetDao, volumeImporterDao, encryptedVolumeActionsDao, volumeVdevRecommendationsDao, detachedVolumeDao, encryptedVolumeImporterDao, zfsTopologyDao, zfsVdevDao, datastoreService, volumeDatasetPropertiesDao, volumeDatasetPropertyAtimeDao, volumeDatasetPropertyCasesensitivityDao, volumeDatasetPropertyCompressionDao, volumeDatasetPropertyDedupDao, volumeDatasetPropertyQuotaDao, volumeDatasetPropertyRefquotaDao, volumeDatasetPropertyVolblocksizeDao, volumeDatasetPropertyRefreservationDao, volumeDatasetPropertyReservationDao, permissionsDao) {
        var _this = _super.call(this, [
            model_1.Model.Volume,
            model_1.Model.VolumeDataset,
            model_1.Model.VolumeSnapshot,
            model_1.Model.DetachedVolume
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
        _this.zfsVdevDao = zfsVdevDao;
        _this.datastoreService = datastoreService;
        _this.volumeDatasetPropertiesDao = volumeDatasetPropertiesDao;
        _this.volumeDatasetPropertyAtimeDao = volumeDatasetPropertyAtimeDao;
        _this.volumeDatasetPropertyCasesensitivityDao = volumeDatasetPropertyCasesensitivityDao;
        _this.volumeDatasetPropertyCompressionDao = volumeDatasetPropertyCompressionDao;
        _this.volumeDatasetPropertyDedupDao = volumeDatasetPropertyDedupDao;
        _this.volumeDatasetPropertyQuotaDao = volumeDatasetPropertyQuotaDao;
        _this.volumeDatasetPropertyRefquotaDao = volumeDatasetPropertyRefquotaDao;
        _this.volumeDatasetPropertyVolblocksizeDao = volumeDatasetPropertyVolblocksizeDao;
        _this.volumeDatasetPropertyRefreservationDao = volumeDatasetPropertyRefreservationDao;
        _this.volumeDatasetPropertyReservationDao = volumeDatasetPropertyReservationDao;
        _this.permissionsDao = permissionsDao;
        _this.DEFAULT_SOURCE_SETTING = { source: VolumeRepository.INHERITED };
        _this.DEFAULT_VOLBLOCKSIZE_SETTING = { parsed: VolumeRepository.DEFAULT_VOLBLOCKSIZE };
        return _this;
    }
    VolumeRepository.getInstance = function () {
        if (!VolumeRepository.instance) {
            VolumeRepository.instance = new VolumeRepository(new volume_dao_1.VolumeDao(), new volume_snapshot_dao_1.VolumeSnapshotDao(), new volume_dataset_dao_1.VolumeDatasetDao(), new volume_importer_dao_1.VolumeImporterDao(), new encrypted_volume_actions_dao_1.EncryptedVolumeActionsDao(), new volume_vdev_recommendations_dao_1.VolumeVdevRecommendationsDao(), new detached_volume_dao_1.DetachedVolumeDao(), new encrypted_volume_importer_dao_1.EncryptedVolumeImporterDao(), new zfs_topology_dao_1.ZfsTopologyDao(), new zfs_vdev_dao_1.ZfsVdevDao(), datastore_service_1.DatastoreService.getInstance(), new volume_dataset_properties_dao_1.VolumeDatasetPropertiesDao(), new volume_dataset_property_atime_dao_1.VolumeDatasetPropertyAtimeDao(), new volume_dataset_property_casesensitivity_dao_1.VolumeDatasetPropertyCasesensitivityDao(), new volume_dataset_property_compression_dao_1.VolumeDatasetPropertyCompressionDao(), new volume_dataset_property_dedup_dao_1.VolumeDatasetPropertyDedupDao(), new volume_dataset_property_quota_dao_1.VolumeDatasetPropertyQuotaDao(), new volume_dataset_property_refquota_dao_1.VolumeDatasetPropertyRefquotaDao(), new volume_dataset_property_volblocksize_dao_1.VolumeDatasetPropertyVolblocksizeDao(), new volume_dataset_property_refreservation_dao_1.VolumeDatasetPropertyRefreservationDao(), new volume_dataset_property_reservation_dao_1.VolumeDatasetPropertyReservationDao(), new permissions_dao_1.PermissionsDao());
        }
        return VolumeRepository.instance;
    };
    VolumeRepository.prototype.listVolumes = function () {
        return this.volumes ? Promise.resolve(this.volumes.valueSeq().toJS()) : this.volumeDao.list();
    };
    VolumeRepository.prototype.listDatasets = function () {
        return this.volumeDatasets ? Promise.resolve(this.volumeDatasets.valueSeq().toJS()) : this.volumeDatasetDao.list();
    };
    VolumeRepository.prototype.listSnapshots = function () {
        return this.volumeSnapshots ? Promise.resolve(this.volumeSnapshots.valueSeq().toJS()) : this.volumeSnapshotDao.list();
    };
    VolumeRepository.prototype.getVolumeImporter = function () {
        return this.volumeImporterDao.get();
    };
    VolumeRepository.prototype.getNewVolumeSnapshot = function () {
        return this.volumeSnapshotDao.getNewInstance();
    };
    VolumeRepository.prototype.getNewVolumeDataset = function () {
        return this.volumeDatasetDao.getNewInstance();
    };
    VolumeRepository.prototype.getNewVolume = function () {
        return this.volumeDao.getNewInstance();
    };
    VolumeRepository.prototype.getEncryptedVolumeActionsInstance = function () {
        return this.encryptedVolumeActionsDao.getNewInstance();
    };
    VolumeRepository.prototype.initializeDisksAllocations = function (diskIds) {
        var _this = this;
        this.volumeDao.getDisksAllocation(diskIds).then(function (allocations) { return _.forIn(allocations, function (allocation, path) { return _this.setDiskAllocation(path, allocation); }); });
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
    VolumeRepository.prototype.upgradeVolume = function (volume) {
        return this.volumeDao.upgrade(volume);
    };
    VolumeRepository.prototype.listDetachedVolumes = function () {
        return this.detachedVolumes ? Promise.resolve(this.detachedVolumes.valueSeq().toJS()) : this.findDetachedVolumes();
    };
    VolumeRepository.prototype.findDetachedVolumes = function () {
        return this.detachedVolumeDao.list();
    };
    VolumeRepository.prototype.importDetachedVolume = function (volume) {
        return this.detachedVolumeDao.import(volume);
    };
    VolumeRepository.prototype.deleteDetachedVolume = function (volume) {
        return this.detachedVolumeDao.delete(volume);
    };
    VolumeRepository.prototype.exportVolume = function (volume) {
        var _this = this;
        return this.volumeDao.export(volume).then(function () { return _this.findDetachedVolumes(); });
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
        var _this = this;
        return this.volumeDao.importDisk(disk, path, fsType)
            .then(function (task) { return task.taskPromise; })
            .then(function () { return _this.findDetachedVolumes(); });
    };
    VolumeRepository.prototype.updateVolumeTopology = function (volume, topology) {
        volume.topology = this.cleanupTopology(topology);
        // FIXME: Remove once the middleware stops sending erroneous data
        if (!volume.providers_presence) {
            volume.providers_presence = 'NONE';
        }
        return this.volumeDao.save(volume);
    };
    VolumeRepository.prototype.getNewZfsVdev = function () {
        return this.zfsVdevDao.getNewInstance();
    };
    VolumeRepository.prototype.initializeDatasetProperties = function (dataset) {
        var _this = this;
        return dataset.properties ?
            Promise.resolve(dataset) :
            Promise.all([
                this.volumeDatasetPropertiesDao.getNewInstance(),
                this.volumeDatasetPropertyAtimeDao.getNewInstance(),
                this.volumeDatasetPropertyCasesensitivityDao.getNewInstance(),
                this.volumeDatasetPropertyCompressionDao.getNewInstance(),
                this.volumeDatasetPropertyDedupDao.getNewInstance(),
                this.volumeDatasetPropertyQuotaDao.getNewInstance(),
                this.volumeDatasetPropertyRefquotaDao.getNewInstance(),
                this.volumeDatasetPropertyVolblocksizeDao.getNewInstance(),
                this.volumeDatasetPropertyRefreservationDao.getNewInstance(),
                this.volumeDatasetPropertyReservationDao.getNewInstance()
            ]).spread(function (properties, atime, casesensitivity, compression, dedup, quota, refquota, volblocksize, refreservation, reservation) {
                properties.atime = _.assign(atime, _this.DEFAULT_SOURCE_SETTING);
                properties.casesensitivity = _.assign(casesensitivity, _this.DEFAULT_SOURCE_SETTING);
                properties.dedup = _.assign(dedup, _this.DEFAULT_SOURCE_SETTING);
                properties.compression = _.assign(compression, _this.DEFAULT_SOURCE_SETTING);
                properties.quota = quota;
                properties.refquota = refquota;
                properties.volblocksize = _.assign(volblocksize, _this.DEFAULT_VOLBLOCKSIZE_SETTING);
                properties.refreservation = refreservation;
                properties.reservation = reservation;
                dataset.properties = properties;
            });
    };
    VolumeRepository.prototype.convertVolumeDatasetSizeProperties = function (dataset) {
        if (dataset.type === 'FILESYSTEM') {
            dataset.properties.quota.parsed = bytes.parse(dataset.properties.quota.value);
            dataset.properties.refquota.parsed = bytes.parse(dataset.properties.refquota.value);
            dataset.properties.reservation.parsed = bytes.parse(dataset.properties.reservation.value);
            dataset.properties.refreservation.parsed = bytes.parse(dataset.properties.refreservation.value);
        }
        else {
            dataset.volsize = bytes.parse(dataset.volsize);
        }
    };
    // FIXME May need to be moved at a higher level (PermissionsService ?)
    VolumeRepository.prototype.getNewPermissions = function () {
        return this.permissionsDao.getNewInstance();
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
    VolumeRepository.prototype.cleanupVdev = function (vdev, isChild) {
        if (isChild === void 0) { isChild = false; }
        var clean;
        if (vdev.type === 'disk' || isChild) {
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
                clean.children.push(this.cleanupVdev(child, true));
            }
        }
        if (vdev.guid) {
            clean.guid = vdev.guid;
        }
        return clean;
    };
    VolumeRepository.prototype.updateVolumesDiskUsage = function (volumes, usageType) {
        var diskUsage = {};
        if (volumes) {
            volumes.forEach(function (volume) { return _.forEach(VolumeRepository.TOPOLOGY_KEYS, function (topologyKey) { return volume.get('topology').get(topologyKey).forEach(function (vdev) { return vdev.get('children').map(function (child) { return child.get('path'); }).forEach(function (path) { return diskUsage[path] = volume.has('name') ? volume.get('name') : volume.get('id'); }); }); }); });
            this.datastoreService.save(model_1.Model.DiskUsage, usageType, diskUsage);
        }
    };
    VolumeRepository.prototype.setDiskAllocation = function (path, allocation) {
        var usageType;
        switch (allocation.type) {
            case 'VOLUME':
                usageType = 'attached';
                break;
            case 'EXPORTED_VOLUME':
                usageType = 'detached';
                break;
            case 'BOOT':
                usageType = 'boot';
                break;
        }
        var diskUsage = this.datastoreService.getState().has(model_1.Model.DiskUsage) &&
            this.datastoreService.getState().get(model_1.Model.DiskUsage).has(usageType) ?
            this.datastoreService.getState().get(model_1.Model.DiskUsage).get(usageType).toJS() :
            {};
        diskUsage[path] = allocation.name || 'boot';
        this.datastoreService.save(model_1.Model.DiskUsage, usageType, diskUsage);
    };
    VolumeRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case model_1.Model.Volume:
                var self_1 = this, volumeId_1;
                var hasTopologyChanged_1 = false;
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
                    this.updateVolumesDiskUsage(state, 'attached');
                }
                this.volumes = this.dispatchModelEvents(this.volumes, model_event_name_1.ModelEventName.Volume, state);
                break;
            case model_1.Model.VolumeSnapshot:
                this.volumeSnapshots = this.dispatchModelEvents(this.volumeSnapshots, model_event_name_1.ModelEventName.VolumeSnapshot, state);
                break;
            case model_1.Model.VolumeDataset:
                this.volumeDatasets = this.dispatchModelEvents(this.volumeDatasets, model_event_name_1.ModelEventName.VolumeDataset, state);
                break;
            case model_1.Model.DetachedVolume:
                this.detachedVolumes = this.dispatchModelEvents(this.detachedVolumes, model_event_name_1.ModelEventName.DetachedVolume, state);
                this.updateVolumesDiskUsage(this.detachedVolumes, 'detached');
                break;
            default:
                break;
        }
    };
    VolumeRepository.prototype.handleEvent = function () { };
    return VolumeRepository;
}(abstract_repository_ng_1.AbstractRepository));
VolumeRepository.TOPOLOGY_KEYS = ['data', 'cache', 'log', 'spare'];
VolumeRepository.INHERITED = 'INHERITED';
VolumeRepository.DEFAULT_VOLBLOCKSIZE = 512;
exports.VolumeRepository = VolumeRepository;
