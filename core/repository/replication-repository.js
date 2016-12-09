"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var model_event_name_1 = require("../model-event-name");
var replication_options_dao_1 = require("../dao/replication-options-dao");
var replication_dao_1 = require("../dao/replication-dao");
var ReplicationRepository = (function (_super) {
    __extends(ReplicationRepository, _super);
    function ReplicationRepository(replicationDao, replicationOptionsDao) {
        var _this = _super.call(this, ['Replication']) || this;
        _this.replicationDao = replicationDao;
        _this.replicationOptionsDao = replicationOptionsDao;
        return _this;
    }
    ReplicationRepository.getInstance = function () {
        if (!ReplicationRepository.instance) {
            ReplicationRepository.instance = new ReplicationRepository(replication_dao_1.ReplicationDao.getInstance(), replication_options_dao_1.ReplicationOptionsDao.getInstance());
        }
        return ReplicationRepository.instance;
    };
    ReplicationRepository.prototype.listReplications = function () {
        return this.replicationDao.list();
    };
    ReplicationRepository.prototype.getReplicationOptionsInstance = function () {
        return this.replicationOptionsDao.getNewInstance();
    };
    ReplicationRepository.prototype.replicateDataset = function (dataset, replicationOptions, transportOptions) {
        return this.replicationDao.replicateDataset(dataset, replicationOptions, transportOptions);
    };
    ReplicationRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'Replication':
                this.replications = this.dispatchModelEvents(this.replications, model_event_name_1.ModelEventName.Replication, state);
                break;
            default:
                break;
        }
    };
    ReplicationRepository.prototype.getReplicationId = function (replication) {
        return replication._replication ? replication._replication.id :
            replication.id ? replication.id : replication;
    };
    return ReplicationRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.ReplicationRepository = ReplicationRepository;
