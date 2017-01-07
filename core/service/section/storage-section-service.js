"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var share_repository_1 = require("../../repository/share-repository");
var disk_repository_1 = require("../../repository/disk-repository");
var volume_repository_1 = require("../../repository/volume-repository");
var topology_service_1 = require("../topology-service");
var model_1 = require("../../model");
var vmware_repository_1 = require("../../repository/vmware-repository");
var model_event_name_1 = require("../../model-event-name");
var replication_repository_1 = require("../../repository/replication-repository");
var task_repository_1 = require("../../repository/task-repository");
var peer_repository_1 = require("../../repository/peer-repository");
var network_repository_1 = require("../../repository/network-repository");
var service_repository_1 = require("../../repository/service-repository");
var Promise = require("bluebird");
var _ = require("lodash");
var StorageSectionService = (function (_super) {
    __extends(StorageSectionService, _super);
    function StorageSectionService() {
        return _super.apply(this, arguments) || this;
    }
    StorageSectionService.prototype.init = function () {
        var self = this;
        this.shareRepository = share_repository_1.ShareRepository.getInstance();
        this.diskRepository = disk_repository_1.DiskRepository.getInstance();
        this.volumeRepository = volume_repository_1.VolumeRepository.getInstance();
        this.vmwareRepository = vmware_repository_1.VmwareRepository.getInstance();
        this.replicationRepository = replication_repository_1.ReplicationRepository.getInstance();
        this.taskRepository = task_repository_1.TaskRepository.getInstance();
        this.peerRepository = peer_repository_1.PeerRepository.getInstance();
        this.networkRepository = network_repository_1.NetworkRepository.getInstance();
        this.serviceRepository = service_repository_1.ServiceRepository.getInstance();
        this.topologyService = topology_service_1.TopologyService.getInstance();
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Disk.listChange, this.handleDisksChange.bind(this));
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Volume.listChange, this.handleVolumesChange.bind(this));
        return this.topologyService.init();
    };
    StorageSectionService.prototype.loadEntries = function () {
        this.entries = [];
        return this.volumeRepository.listVolumes();
    };
    StorageSectionService.prototype.loadExtraEntries = function () {
        return Promise.all([
            this.volumeRepository.getVolumeImporter()
        ]);
    };
    StorageSectionService.prototype.loadOverview = function () {
        var self = this;
        this.storageOverview = {};
        return Promise.all([
            this.loadEntries()
        ]).then(function () {
            self.storageOverview.volumes = self.entries;
            return self.storageOverview;
        });
    };
    StorageSectionService.prototype.loadSettings = function () {
        return undefined;
    };
    StorageSectionService.prototype.getVdevRecommendation = function (redundancy, speed, storage) {
        return this.topologyService.getVdevRecommendation(redundancy, speed, storage);
    };
    StorageSectionService.prototype.setRootDatasetForVolume = function (volume) {
        return this.volumeRepository.listDatasets().then(function (datasets) {
            for (var _i = 0, datasets_1 = datasets; _i < datasets_1.length; _i++) {
                var dataset = datasets_1[_i];
                if (dataset.id === volume.id) {
                    return volume._rootDataset = dataset;
                }
            }
        });
    };
    StorageSectionService.prototype.listShares = function () {
        return this.shareRepository.listShares();
    };
    StorageSectionService.prototype.listSnapshots = function () {
        return this.volumeRepository.listSnapshots();
    };
    StorageSectionService.prototype.listDatasets = function () {
        return this.volumeRepository.listDatasets();
    };
    StorageSectionService.prototype.listVmwareDatasets = function () {
        return this.vmwareRepository.listDatasets();
    };
    StorageSectionService.prototype.listPeers = function () {
        return this.peerRepository.listPeers();
    };
    StorageSectionService.prototype.getEncryptedVolumeActionsForVolume = function (volume) {
        return this.volumeRepository.getEncryptedVolumeActionsInstance().then(function (encryptedVolumeActions) {
            encryptedVolumeActions.volume = volume;
            return encryptedVolumeActions;
        });
    };
    StorageSectionService.prototype.listDisks = function () {
        var _this = this;
        if (!this.initialDiskAllocationPromise || this.initialDiskAllocationPromise.isRejected()) {
            this.initialDiskAllocationPromise = this.diskRepository.listDisks().then(function (disks) {
                _this.volumeRepository.initializeDisksAllocations(_.map(disks, 'path'));
                return disks;
            });
        }
        return this.initialDiskAllocationPromise;
    };
    StorageSectionService.prototype.clearReservedDisks = function () {
        return this.diskRepository.clearReservedDisks();
    };
    StorageSectionService.prototype.listAvailableDisks = function () {
        var _this = this;
        return this.listDisks().then(function () { return _this.diskRepository.listAvailableDisks(); });
    };
    StorageSectionService.prototype.findDetachedVolumes = function () {
        return this.volumeRepository.findDetachedVolumes();
    };
    StorageSectionService.prototype.importDetachedVolume = function (volume) {
        return this.volumeRepository.importDetachedVolume(volume);
    };
    StorageSectionService.prototype.deleteDetachedVolume = function (volume) {
        return this.volumeRepository.deleteDetachedVolume(volume);
    };
    StorageSectionService.prototype.exportVolume = function (volume) {
        return this.volumeRepository.exportVolume(volume);
    };
    StorageSectionService.prototype.getEncryptedVolumeImporterInstance = function () {
        return this.volumeRepository.getEncryptedVolumeImporterInstance();
    };
    StorageSectionService.prototype.getNewTopology = function () {
        return this.volumeRepository.getTopologyInstance();
    };
    StorageSectionService.prototype.clearTopology = function (topology) {
        return this.volumeRepository.clearTopology(topology);
    };
    StorageSectionService.prototype.getTopologyProxy = function (topology) {
        var _this = this;
        var pairs = _.map(volume_repository_1.VolumeRepository.TOPOLOGY_KEYS, function (key) { return [key, []]; });
        var topologyProxy = _.fromPairs(pairs);
        _.forEach(volume_repository_1.VolumeRepository.TOPOLOGY_KEYS, function (key) { return topologyProxy[key] = _this.cloneVdevs(topology[key]); });
        return topologyProxy;
    };
    StorageSectionService.prototype.generateTopology = function (disks, topologyProfile) {
        // let self = this;
        // this.clearReservedDisks();
        // let vdev, j, disksLength,
        //     priorities = self.topologyService.generateTopology(this.diskRepository.listAvailableDisks(), redundancy, speed, storage);
        // for (let i = 0, vdevsLength = topology.data.length; i < vdevsLength; i++) {
        //     vdev = topology.data[i];
        //     if (Array.isArray(vdev.children)) {
        //         for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
        //             self.markDiskAsReserved(vdev.children[j].path);
        //         }
        //     } else {
        //         self.markDiskAsReserved(vdev.path);
        //     }
        // }
        return this.topologyService.generateTopology(this.diskRepository.listAvailableDisks(), topologyProfile);
    };
    StorageSectionService.prototype.getNewZfsVdev = function () {
        return this.volumeRepository.getNewZfsVdev();
    };
    StorageSectionService.prototype.getVdevFromDisk = function (disk) {
        return this.isVdev(disk) ? disk : this.topologyService.diskToVdev(disk);
    };
    StorageSectionService.prototype.isVdev = function (disk) {
        return disk._objectType === model_1.Model.ZfsVdev;
    };
    StorageSectionService.prototype.isVolumeDataset = function (object) {
        return object._objectType === model_1.Model.VolumeDataset;
    };
    StorageSectionService.prototype.updateVolumeTopology = function (volume, topology) {
        return this.volumeRepository.updateVolumeTopology(volume, topology);
    };
    StorageSectionService.prototype.markDiskAsReserved = function (diskPath) {
        this.diskRepository.markDiskAsReserved(diskPath);
    };
    StorageSectionService.prototype.markDiskAsNonReserved = function (diskPath) {
        this.diskRepository.markDiskAsNonReserved(diskPath);
    };
    StorageSectionService.prototype.getDiskAllocation = function (disk) {
        return this.diskRepository.getDiskAllocation(disk);
    };
    StorageSectionService.prototype.createVolume = function (volume) {
        var password = volume._password && volume._password.length > 0 ? volume._password : null;
        volume.password_encrypted = !!password;
        return this.volumeRepository.createVolume(volume, password);
    };
    StorageSectionService.prototype.scrubVolume = function (volume) {
        return this.volumeRepository.scrubVolume(volume);
    };
    StorageSectionService.prototype.upgradeVolume = function (volume) {
        return this.volumeRepository.upgradeVolume(volume);
    };
    StorageSectionService.prototype.lockVolume = function (volume) {
        return this.volumeRepository.lockVolume(volume);
    };
    StorageSectionService.prototype.unlockVolume = function (volume, password) {
        return this.volumeRepository.unlockVolume(volume, password);
    };
    StorageSectionService.prototype.rekeyVolume = function (volume, key, password) {
        return this.volumeRepository.rekeyVolume(volume, key, password);
    };
    StorageSectionService.prototype.getVolumeKey = function (volume) {
        return this.volumeRepository.getVolumeKey(volume);
    };
    StorageSectionService.prototype.importEncryptedVolume = function (name, disks, key, password) {
        return this.volumeRepository.importEncryptedVolume(name, disks, key, password);
    };
    StorageSectionService.prototype.getReplicationOptionsInstance = function () {
        return this.replicationRepository.getReplicationOptionsInstance();
    };
    StorageSectionService.prototype.replicateDataset = function (dataset, replicationOptions, transportOptions) {
        return this.replicationRepository.replicateDataset(dataset, replicationOptions, transportOptions);
    };
    StorageSectionService.prototype.listImportableDisks = function () {
        return this.volumeRepository.listImportableDisks();
    };
    StorageSectionService.prototype.importDisk = function (disk, path, fsType) {
        return this.volumeRepository.importDisk(disk, path, fsType);
    };
    StorageSectionService.prototype.listVmwareDatastores = function (peer) {
        return this.vmwareRepository.listDatastores(peer);
    };
    StorageSectionService.prototype.listNetworkInterfaces = function () {
        return this.networkRepository.listNetworkInterfaces();
    };
    StorageSectionService.prototype.listServices = function () {
        return this.serviceRepository.listServices();
    };
    StorageSectionService.prototype.cloneVdevs = function (vdevs) {
        return _.map(vdevs, function (vdev) {
            var clone = _.cloneDeep(vdev);
            switch (clone.type) {
                case 'disk':
                    clone.children = _.castArray(_.cloneWith(vdev, function (value, key) { return key === 'children' ? [] : undefined; }));
                    break;
                default:
                    break;
            }
            return clone;
        });
    };
    StorageSectionService.prototype.handleDisksChange = function (disks) {
    };
    StorageSectionService.prototype.handleVolumesChange = function (volumes) {
        var self = this;
        volumes.forEach(function (volume) {
            // DTM
            var entry = self.findObjectWithId(self.entries, volume.get('id'));
            if (entry) {
                Object.assign(entry, volume.toJS());
            }
            else {
                entry = volume.toJS();
                entry._objectType = 'Volume';
                self.entries.push(entry);
            }
        });
        // DTM
        if (this.entries) {
            for (var i = this.entries.length - 1; i >= 0; i--) {
                if (!volumes.has(this.entries[i].id)) {
                    this.entries.splice(i, 1);
                }
            }
        }
        this.storageOverview.volumes = this.entries;
    };
    return StorageSectionService;
}(abstract_section_service_ng_1.AbstractSectionService));
exports.StorageSectionService = StorageSectionService;
