"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var service_dao_1 = require("../dao/service-dao");
var services_category_dao_1 = require("../dao/services-category-dao");
var Promise = require("bluebird");
var _ = require("lodash");
var ServiceRepository = (function (_super) {
    __extends(ServiceRepository, _super);
    function ServiceRepository(serviceDao, servicesCategoryDao) {
        var _this = _super.call(this, ['Service']) || this;
        _this.serviceDao = serviceDao;
        _this.servicesCategoryDao = servicesCategoryDao;
        return _this;
    }
    ServiceRepository.getInstance = function () {
        if (!ServiceRepository.instance) {
            ServiceRepository.instance = new ServiceRepository(new service_dao_1.ServiceDao(), new services_category_dao_1.ServicesCategoryDao());
        }
        return ServiceRepository.instance;
    };
    ServiceRepository.prototype.listServices = function () {
        return this.serviceDao.list();
    };
    ServiceRepository.prototype.saveService = function (service) {
        return this.serviceDao.save(service);
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
    ServiceRepository.prototype.handleStateChange = function (name, data) { };
    ServiceRepository.prototype.handleEvent = function (name, data) { };
    return ServiceRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.ServiceRepository = ServiceRepository;
