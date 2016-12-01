"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var share_repository_1 = require("core/repository/share-repository");
var disk_repository_1 = require("core/repository/disk-repository");
var volume_repository_1 = require("core/repository/volume-repository");
var topology_service_1 = require("core/service/topology-service");
var model_1 = require("core/model/model");
var vmware_repository_1 = require("../../repository/vmware-repository");
var StorageSectionService = (function (_super) {
    __extends(StorageSectionService, _super);
    function StorageSectionService() {
        var _this = _super.apply(this, arguments) || this;
        _this.SHARE_TYPE = model_1.Model.Share;
        _this.VOLUME_DATASET_TYPE = model_1.Model.VolumeDataset;
        _this.VOLUME_SNAPSHOT_TYPE = model_1.Model.VolumeSnapshot;
        _this.TOPOLOGY_TYPE = model_1.Model.ZfsTopology;
        return _this;
    }
    StorageSectionService.prototype.init = function () {
        var self = this;
        this.shareRepository = share_repository_1.ShareRepository.getInstance();
        this.diskRepository = disk_repository_1.DiskRepository.getInstance();
        this.volumeRepository = volume_repository_1.VolumeRepository.getInstance();
        this.vmwareRepository = vmware_repository_1.VmwareRepository.getInstance();
        this.volumeRepository.getVdevRecommendations().then(function (vdevRecommendations) {
            self.topologyService = topology_service_1.TopologyService.instance.init(vdevRecommendations);
        });
        this.eventDispatcherService.addEventListener('disksChange', this.handleDisksChange.bind(this));
        this.eventDispatcherService.addEventListener('volumesChange', this.handleVolumesChange.bind(this));
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
    StorageSectionService.prototype.loadSettings = function () { };
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
    StorageSectionService.prototype.getEncryptedVolumeActionsForVolume = function (volume) {
        return this.volumeRepository.getEncryptedVolumeActionsInstance().then(function (encryptedVolumeActions) {
            encryptedVolumeActions.volume = volume;
            return encryptedVolumeActions;
        });
    };
    StorageSectionService.prototype.clearReservedDisks = function () {
        return this.diskRepository.clearReservedDisks();
    };
    StorageSectionService.prototype.listAvailableDisks = function () {
        return this.diskRepository.listAvailableDisks();
    };
    StorageSectionService.prototype.generateTopology = function (topology, disks, redundancy, speed, storage) {
        var self = this;
        this.clearReservedDisks();
        var vdev, j, disksLength, priorities = self.topologyService.generateTopology(topology, this.diskRepository.listAvailableDisks(), redundancy, speed, storage);
        for (var i = 0, vdevsLength = topology.data.length; i < vdevsLength; i++) {
            vdev = topology.data[i];
            if (Array.isArray(vdev.children)) {
                for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                    self.markDiskAsReserved(vdev.children[j]);
                }
            }
            else {
                self.markDiskAsReserved(vdev);
            }
        }
        return priorities;
    };
    StorageSectionService.prototype.markDiskAsReserved = function (diskId) {
        this.diskRepository.markDiskAsReserved(diskId);
    };
    StorageSectionService.prototype.markDiskAsNonReserved = function (diskId) {
        this.diskRepository.markDiskAsNonReserved(diskId);
    };
    StorageSectionService.prototype.createVolume = function (volume) {
        return this.volumeRepository.createVolume(volume);
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
        var availablePaths;
        this.volumeRepository.getAvailableDisks().then(function (paths) {
            availablePaths = paths;
            return self.diskRepository.listDisks();
        }).then(function (disks) {
            return self.volumeRepository.getDisksAllocations(disks.map(function (x) { return x.id; }));
        }).then(function (disksAllocations) {
            return self.diskRepository.updateDiskUsage(availablePaths, disksAllocations);
        });
    };
    return StorageSectionService;
}(abstract_section_service_ng_1.AbstractSectionService));
exports.StorageSectionService = StorageSectionService;
