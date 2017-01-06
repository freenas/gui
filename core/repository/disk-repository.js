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
var datastore_service_1 = require("../service/datastore-service");
var immutable_1 = require("immutable");
var DiskRepository = (function (_super) {
    __extends(DiskRepository, _super);
    function DiskRepository(diskDao, datastoreService) {
        var _this = _super.call(this, [
            model_1.Model.Disk,
            model_1.Model.DiskUsage
        ]) || this;
        _this.diskDao = diskDao;
        _this.datastoreService = datastoreService;
        return _this;
    }
    DiskRepository.getInstance = function () {
        if (!DiskRepository.instance) {
            DiskRepository.instance = new DiskRepository(new disk_dao_1.DiskDao(), datastore_service_1.DatastoreService.getInstance());
        }
        return DiskRepository.instance;
    };
    DiskRepository.prototype.listDisks = function () {
        return this.disks ? Promise.resolve(this.disks.valueSeq().toJS()) : this.diskDao.list();
    };
    DiskRepository.prototype.clearReservedDisks = function () {
        this.datastoreService.save(model_1.Model.DiskUsage, 'reserved', {});
    };
    DiskRepository.prototype.listAvailableDisks = function () {
        return this.availableDisks.valueSeq().toJS();
    };
    DiskRepository.prototype.getDiskAllocation = function (disk) {
        var allocation;
        if (this.diskUsage.has('attached') && this.diskUsage.get('attached').has(disk.path)) {
            allocation = {
                name: this.diskUsage.get('attached').get(disk.path),
                type: 'VOLUME'
            };
        }
        else if (this.diskUsage.has('detached') && this.diskUsage.get('detached').has(disk.path)) {
            allocation = {
                name: this.diskUsage.get('detached').get(disk.path),
                type: 'EXPORTED_VOLUME'
            };
        }
        else if (this.diskUsage.has('boot') && this.diskUsage.get('boot').has(disk.path)) {
            allocation = {
                type: 'BOOT'
            };
        }
        return allocation;
    };
    DiskRepository.prototype.markDiskAsReserved = function (diskPath) {
        var diskUsage = this.datastoreService.getState().get(model_1.Model.DiskUsage) &&
            this.datastoreService.getState().get(model_1.Model.DiskUsage).has('reserved') ?
            this.datastoreService.getState().get(model_1.Model.DiskUsage).get('reserved').toJS() :
            {};
        diskUsage[diskPath] = 'temp';
        this.datastoreService.save(model_1.Model.DiskUsage, 'reserved', diskUsage);
    };
    DiskRepository.prototype.markDiskAsNonReserved = function (diskPath) {
        var diskUsage = this.datastoreService.getState().get(model_1.Model.DiskUsage) &&
            this.datastoreService.getState().get(model_1.Model.DiskUsage).has('reserved') ?
            this.datastoreService.getState().get(model_1.Model.DiskUsage).get('reserved').toJS() :
            {};
        delete diskUsage[diskPath];
        this.datastoreService.save(model_1.Model.DiskUsage, 'reserved', diskUsage);
    };
    DiskRepository.prototype.getAvailableDisks = function (disks, diskUsage) {
        var _this = this;
        return immutable_1.Map(disks.filter(function (disk) { return disk.get('online') &&
            !_this.isDiskUsed(disk, diskUsage.get('attached')) &&
            !_this.isDiskUsed(disk, diskUsage.get('boot')) &&
            !_this.isDiskUsed(disk, diskUsage.get('reserved')); }));
    };
    DiskRepository.prototype.isDiskUsed = function (disk, diskUsage) {
        return diskUsage && diskUsage.has(disk.get('path'));
    };
    DiskRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case model_1.Model.Disk:
                this.disks = this.dispatchModelEvents(this.disks, model_event_name_1.ModelEventName.Disk, state);
                break;
            case model_1.Model.DiskUsage:
                this.availableDisks = this.getAvailableDisks(this.disks, state);
                this.diskUsage = state;
                this.eventDispatcherService.dispatch('AvailableDisksChanged', this.availableDisks);
                break;
            default:
                break;
        }
    };
    DiskRepository.prototype.handleEvent = function (name, data) { };
    return DiskRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.DiskRepository = DiskRepository;
