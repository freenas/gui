"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var service_dao_1 = require("../dao/service-dao");
var services_category_dao_1 = require("../dao/services-category-dao");
var service_dyndns_dao_1 = require("../dao/service-dyndns-dao");
var service_ups_dao_1 = require("../dao/service-ups-dao");
var Promise = require("bluebird");
var _ = require("lodash");
var rsyncd_module_dao_1 = require("../dao/rsyncd-module-dao");
var model_event_name_1 = require("../model-event-name");
var ServiceRepository = (function (_super) {
    __extends(ServiceRepository, _super);
    function ServiceRepository(serviceDao, serviceDyndnsDao, servicesCategoryDao, rsyncdModuleDao, serviceUpsDao) {
        _super.call(this, [
            'Service',
            'RsyncdModule'
        ]);
        this.serviceDao = serviceDao;
        this.serviceDyndnsDao = serviceDyndnsDao;
        this.servicesCategoryDao = servicesCategoryDao;
        this.rsyncdModuleDao = rsyncdModuleDao;
        this.serviceUpsDao = serviceUpsDao;
    }
    ServiceRepository.getInstance = function () {
        if (!ServiceRepository.instance) {
            ServiceRepository.instance = new ServiceRepository(new service_dao_1.ServiceDao(), new service_dyndns_dao_1.ServiceDyndnsDao, new services_category_dao_1.ServicesCategoryDao(), new rsyncd_module_dao_1.RsyncdModuleDao(), new service_ups_dao_1.ServiceUpsDao());
        }
        return ServiceRepository.instance;
    };
    ServiceRepository.prototype.listServices = function () {
        return this.serviceDao.list();
    };
    ServiceRepository.prototype.saveService = function (service) {
        return this.serviceDao.save(service);
    };
    ServiceRepository.prototype.listRsyncdModules = function () {
        var promise = this.rsyncdModules ? Promise.resolve(this.rsyncdModules.toSet().toJS()) : this.rsyncdModuleDao.list();
        return promise.then(function (rsyncdModules) {
            rsyncdModules._objectType = 'RsyncdModule';
            return rsyncdModules;
        });
    };
    ServiceRepository.prototype.getNewRsyncdModule = function () {
        return this.rsyncdModuleDao.getNewInstance();
    };
    ServiceRepository.prototype.listServicesCategories = function () {
        var self = this;
        return this.listServices().then(function (services) {
            return Promise.all([
                self.getServicesCategory('Sharing', services, [
                    'smb',
                    'nfs',
                    'afp',
                    'webdav',
                    'iscsi'
                ]),
                self.getServicesCategory('Management', services, [
                    'sshd',
                    'smartd',
                    'dyndns',
                    'snmp',
                    'lldp',
                    'ups',
                    'dc'
                ]),
                self.getServicesCategory('File Transfer', services, [
                    'ftp',
                    'rsyncd',
                    'tftpd'
                ])
            ]);
        }).then(function (categories) {
            categories._objectType = 'ServicesCategory';
            return categories;
        });
    };
    ServiceRepository.prototype.getServicesCategory = function (name, services, selectedIds) {
        return this.servicesCategoryDao.getNewInstance().then(function (category) {
            category._isNew = false;
            category.id = _.kebabCase(name);
            category.name = name;
            category.services = services;
            category.types = selectedIds.map(function (x) { return 'service-' + x; });
            return category;
        });
    };
    ServiceRepository.prototype.listDyndnsProviders = function () {
        return this.serviceDyndnsDao.getProviders();
    };
    ServiceRepository.prototype.listUpsDrivers = function () {
        return this.serviceUpsDao.getDrivers();
    };
    ServiceRepository.prototype.listUpsUsbDevices = function () {
        return this.serviceUpsDao.getUsbDevices();
    };
    ServiceRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'RsyncdModule':
                this.rsyncdModules = this.dispatchModelEvents(this.rsyncdModules, model_event_name_1.ModelEventName.RsyncdModule, state);
                break;
        }
    };
    ServiceRepository.prototype.handleEvent = function (name, data) { };
    return ServiceRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.ServiceRepository = ServiceRepository;
