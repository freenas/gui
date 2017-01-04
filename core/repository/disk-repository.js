"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var disk_dao_1 = require("../dao/disk-dao");
var Promise = require("bluebird");
var model_1 = require("../model");
var model_event_name_1 = require("../model-event-name");
var DiskRepository = (function (_super) {
    __extends(DiskRepository, _super);
    function DiskRepository(diskDao) {
        var _this = _super.call(this, [model_1.Model.Disk]) || this;
        _this.diskDao = diskDao;
        _this.reservedDisks = new Set();
        _this.freeDisks = [];
        _this.exportedDisks = new Map();
        _this.usableDisks = [];
        _this.diskAllocations = new Map();
        _this.pathToId = new Map();
        return _this;
    }
    DiskRepository.getInstance = function () {
        if (!DiskRepository.instance) {
            DiskRepository.instance = new DiskRepository(new disk_dao_1.DiskDao());
        }
        return DiskRepository.instance;
    };
    DiskRepository.prototype.listDisks = function () {
        return this.disks ? Promise.resolve(this.disks.valueSeq().toJS()) : this.diskDao.list();
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
        var self = this;
        this.pathToId.clear();
        state.forEach(function (disk, id) {
            self.pathToId.set(disk.get('path'), id);
        });
        this.disks = this.dispatchModelEvents(this.disks, model_event_name_1.ModelEventName.Disk, state);
    };
    DiskRepository.prototype.getDiskId = function (disk) {
        return disk._disk ? disk._disk.id :
            disk.id ? disk.id : disk;
    };
    DiskRepository.prototype.handleEvent = function (name, data) { };
    return DiskRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.DiskRepository = DiskRepository;
