"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var vmware_dataset_dao_1 = require("../dao/vmware-dataset-dao");
var VmwareRepository = (function (_super) {
    __extends(VmwareRepository, _super);
    function VmwareRepository(vmwareDatasetDao) {
        var _this = _super.call(this, [
            'VmwareDataset'
        ]) || this;
        _this.vmwareDatasetDao = vmwareDatasetDao;
        return _this;
    }
    VmwareRepository.getInstance = function () {
        if (!VmwareRepository.instance) {
            VmwareRepository.instance = new VmwareRepository(vmware_dataset_dao_1.VmwareDatasetDao.getInstance());
        }
        return VmwareRepository.instance;
    };
    VmwareRepository.prototype.listDatasets = function () {
        return this.vmwareDatasetDao.list();
    };
    VmwareRepository.prototype.listDatastores = function (peer, isFull) {
    };
    VmwareRepository.prototype.handleStateChange = function (name, state) {
        var self = this;
        switch (name) {
            case 'VmwareDataset':
                this.eventDispatcherService.dispatch('vmwareDatasetsChange', state);
                state.forEach(function (vmwareDataset, id) {
                    if (!self.datasets || !self.datasets.has(id)) {
                        self.eventDispatcherService.dispatch('vmwareDatasetAdd.' + id, vmwareDataset);
                    }
                    else if (self.datasets.get(id) !== vmwareDataset) {
                        self.eventDispatcherService.dispatch('vmwareDatasetChange.' + id, vmwareDataset);
                    }
                });
                if (this.datasets) {
                    this.datasets.forEach(function (vmwareDataset, id) {
                        if (!state.has(id) || state.get(id) !== vmwareDataset) {
                            self.eventDispatcherService.dispatch('vmwareDatasetRemove.' + id, vmwareDataset);
                        }
                    });
                }
                this.datasets = state;
                break;
            default:
                break;
        }
    };
    VmwareRepository.prototype.handleEvent = function () { };
    return VmwareRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.VmwareRepository = VmwareRepository;
