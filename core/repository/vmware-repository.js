"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var vmware_dataset_dao_1 = require("../dao/vmware-dataset-dao");
var vmware_datastore_dao_1 = require("../dao/vmware-datastore-dao");
var model_1 = require("../model");
var model_event_name_1 = require("../model-event-name");
var VmwareRepository = (function (_super) {
    __extends(VmwareRepository, _super);
    function VmwareRepository(vmwareDatasetDao, vmwareDatastoreDao) {
        var _this = _super.call(this, [
            model_1.Model.VmwareDataset,
            model_1.Model.VmwareDatastore
        ]) || this;
        _this.vmwareDatasetDao = vmwareDatasetDao;
        _this.vmwareDatastoreDao = vmwareDatastoreDao;
        return _this;
    }
    VmwareRepository.getInstance = function () {
        if (!VmwareRepository.instance) {
            VmwareRepository.instance = new VmwareRepository(new vmware_dataset_dao_1.VmwareDatasetDao(), new vmware_datastore_dao_1.VmwareDatastoreDao());
        }
        return VmwareRepository.instance;
    };
    VmwareRepository.prototype.listDatasets = function () {
        return this.datasets ? Promise.resolve(this.datasets.valueSeq().toJS()) : this.vmwareDatasetDao.list();
    };
    VmwareRepository.prototype.getNewVmwareDataset = function () {
        return this.vmwareDatasetDao.getNewInstance();
    };
    VmwareRepository.prototype.listDatastores = function (peer) {
        return this.datastores ? Promise.resolve(this.datastores.valueSeq().toJS()) : this.vmwareDatastoreDao.list(peer);
    };
    VmwareRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case model_1.Model.VmwareDataset:
                this.datasets = this.dispatchModelEvents(this.datasets, model_event_name_1.ModelEventName.VmwareDataset, state);
                break;
            case model_1.Model.VmwareDatastore:
                this.datastores = this.dispatchModelEvents(this.datastores, model_event_name_1.ModelEventName.VmwareDatastore, state);
                break;
            default:
                break;
        }
    };
    VmwareRepository.prototype.handleEvent = function () { };
    return VmwareRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.VmwareRepository = VmwareRepository;
