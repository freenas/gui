"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require('./abstract-repository-ng');
var disk_dao_1 = require('../dao/disk-dao');
var model_event_name_1 = require("../model-event-name");
var DiskRepository = (function (_super) {
    __extends(DiskRepository, _super);
    function DiskRepository(diskDao) {
        _super.call(this, ['Disk']);
        this.diskDao = diskDao;
        this.reservedDisks = new Set();
        this.freeDisks = [];
        this.exportedDisks = new Map();
        this.usableDisks = [];
        this.diskAllocations = new Map();
        this.pathToId = new Map();
    }
    DiskRepository.getInstance = function () {
        if (!DiskRepository.instance) {
            DiskRepository.instance = new DiskRepository(new disk_dao_1.DiskDao());
        }
        return DiskRepository.instance;
    };
    DiskRepository.prototype.listDisks = function () {
        return this.diskDao.list();
    };
    DiskRepository.prototype.listAvailableDisks = function () {
        var _this = this;
        return this.disks.valueSeq()
            .filter(function (x) { return _this.usableDisks.indexOf(x.get('id')) !== -1; })
            .filter(function (x) { return !_this.reservedDisks.has(x.get('id')); })
            .map(function (x) { return x.toJS(); })
            .toArray();
    };
    DiskRepository.prototype.clearReservedDisks = function () {
        if (this.reservedDisks.size > 0) {
            this.reservedDisks = new Set();
            this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
        }
    };
    DiskRepository.prototype.markDiskAsReserved = function (disk) {
        var diskId = this.getDiskId(disk);
        this.reservedDisks.add(diskId);
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    };
    DiskRepository.prototype.markDiskAsNonReserved = function (disk) {
        var diskId = this.getDiskId(disk);
        this.reservedDisks.delete(diskId);
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    };
    DiskRepository.prototype.getDiskAllocation = function (disk) {
        if (this.diskAllocations.has(disk.path)) {
            return this.diskAllocations.get(disk.path);
        }
    };
    DiskRepository.prototype.updateDiskUsage = function (availableDisks, disksAllocations) {
        var self = this, allocatedDisks = Object.keys(disksAllocations), exportedDisksPaths = allocatedDisks.filter(function (x) { return disksAllocations[x].type === 'EXPORTED_VOLUME'; });
        this.freeDisks = this.disks.valueSeq()
            .filter(function (x) { return availableDisks.indexOf(x.get('path')) != -1; })
            .filter(function (x) { return allocatedDisks.indexOf(x.get('path')) === -1; })
            .map(function (x) { return x.get('id'); })
            .toArray();
        this.usableDisks = this.freeDisks.slice();
        this.exportedDisks = new Map();
        for (var _i = 0, exportedDisksPaths_1 = exportedDisksPaths; _i < exportedDisksPaths_1.length; _i++) {
            var diskPath = exportedDisksPaths_1[_i];
            this.exportedDisks.set(diskPath, disksAllocations[diskPath].name);
            this.usableDisks.push(this.pathToId.get(diskPath));
        }
        this.diskAllocations.clear();
        this.disks.forEach(function (disk) {
            var diskPath = disk.get('path');
            if (allocatedDisks.indexOf(diskPath) !== -1) {
                self.diskAllocations.set(diskPath, disksAllocations[diskPath]);
            }
        });
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    };
    DiskRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'Disk':
                var self_1 = this;
                this.pathToId.clear();
                state.forEach(function (disk, id) {
                    self_1.pathToId.set(disk.get('path'), id);
                });
                this.disks = this.dispatchModelEvents(this.disks, model_event_name_1.ModelEventName.Disk, state);
                break;
            default:
                break;
        }
    };
    DiskRepository.prototype.getDiskId = function (disk) {
        return disk._disk ? disk._disk.id :
            disk.id ? disk.id : disk;
    };
    return DiskRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.DiskRepository = DiskRepository;
