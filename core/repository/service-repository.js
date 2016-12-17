"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var service_dao_1 = require("../dao/service-dao");
var ServiceRepository = (function (_super) {
    __extends(ServiceRepository, _super);
    function ServiceRepository(serviceDao) {
        var _this = _super.call(this, ['Service']) || this;
        _this.serviceDao = serviceDao;
        return _this;
    }
    ServiceRepository.getInstance = function () {
        if (!ServiceRepository.instance) {
            ServiceRepository.instance = new ServiceRepository(new service_dao_1.ServiceDao());
        }
        return ServiceRepository.instance;
    };
    ServiceRepository.prototype.listServices = function () {
        return this.serviceDao.list();
    };
    ServiceRepository.prototype.saveService = function (service) {
        return this.serviceDao.save(service);
    };
    ServiceRepository.prototype.handleStateChange = function (name, data) { };
    ServiceRepository.prototype.handleEvent = function (name, data) { };
    return ServiceRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.ServiceRepository = ServiceRepository;
