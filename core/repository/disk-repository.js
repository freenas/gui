"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var disk_dao_1 = require("core/dao/disk-dao");
var DiskRepository = (function (_super) {
    __extends(DiskRepository, _super);
    function DiskRepository(diskDao) {
        var _this = _super.call(this, ['Disk']) || this;
        _this.diskDao = diskDao;
        _this.reservedDisks = new Set();
        _this.freeDisks = [];
        _this.exportedDisks = new Map();
        _this.usableDisks = [];
        return _this;
    }
    DiskRepository.getInstance = function () {
        if (!DiskRepository.instance) {
            DiskRepository.instance = new DiskRepository(disk_dao_1.DiskDao.getInstance());
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
    DiskRepository.prototype.updateDiskUsage = function (availableDisks, disksAllocations) {
        var allocatedDisks = Object.keys(disksAllocations), exportedDisksIds = allocatedDisks.filter(function (x) { return disksAllocations[x].type === 'EXPORTED_DISK'; });
        this.freeDisks = this.disks.valueSeq()
            .filter(function (x) { return availableDisks.indexOf(x.get('path')) != -1; })
            .filter(function (x) { return allocatedDisks.indexOf(x.get('id')) === -1; })
            .map(function (x) { return x.get('id'); })
            .toArray();
        this.usableDisks = this.freeDisks.slice();
        this.exportedDisks = new Map();
        for (var _i = 0, exportedDisksIds_1 = exportedDisksIds; _i < exportedDisksIds_1.length; _i++) {
            var diskId = exportedDisksIds_1[_i];
            this.exportedDisks.set(diskId, disksAllocations[diskId].name);
            this.usableDisks.push(diskId);
        }
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    };
    DiskRepository.prototype.handleStateChange = function (name, state) {
        var self = this;
        switch (name) {
            case 'Disk':
                this.eventDispatcherService.dispatch('disksChange', state);
                state.forEach(function (disk, id) {
                    if (!self.disks || !self.disks.has(id)) {
                        self.eventDispatcherService.dispatch('diskAdd.' + id, disk);
                    }
                    else if (self.disks.get(id) !== disk) {
                        self.eventDispatcherService.dispatch('diskChange.' + id, disk);
                    }
                });
                if (this.disks) {
                    this.disks.forEach(function (disk, id) {
                        if (!state.has(id) || state.get(id) !== disk) {
                            self.eventDispatcherService.dispatch('diskRemove.' + id, disk);
                        }
                    });
                }
                this.disks = state;
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
