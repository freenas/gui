"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var system_repository_1 = require("../../repository/system-repository");
var service_repository_1 = require("../../repository/service-repository");
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var network_repository_1 = require("../../repository/network-repository");
var volume_repository_1 = require("../../repository/volume-repository");
var ServiceSectionService = (function (_super) {
    __extends(ServiceSectionService, _super);
    function ServiceSectionService() {
        return _super.apply(this, arguments) || this;
    }
    ServiceSectionService.prototype.init = function () {
        this.systemRepository = system_repository_1.SystemRepository.getInstance();
        this.serviceRepository = service_repository_1.ServiceRepository.getInstance();
        this.networkRepository = network_repository_1.NetworkRepository.getInstance();
        this.volumeRepository = volume_repository_1.VolumeRepository.getInstance();
    };
    ServiceSectionService.prototype.getSystemGeneral = function () {
        return this.systemRepository.getGeneral();
    };
    ServiceSectionService.prototype.saveService = function (service) {
        return this.serviceRepository.saveService(service);
    };
    ServiceSectionService.prototype.getDyndnsProviders = function () {
        return this.serviceRepository.listDyndnsProviders();
    };
    ServiceSectionService.prototype.listNetworkInterfaces = function () {
        return this.networkRepository.listNetworkInterfaces();
    };
    ServiceSectionService.prototype.provideDcIp = function () {
        return this.serviceRepository.provideDcIp();
    };
    ServiceSectionService.prototype.provideDcUrl = function () {
        return this.serviceRepository.provideDcUrl();
    };
    ServiceSectionService.prototype.listvolumes = function () {
        return this.volumeRepository.listVolumes;
    };
    ServiceSectionService.prototype.loadEntries = function () {
        return this.serviceRepository.listServicesCategories();
    };
    ServiceSectionService.prototype.loadExtraEntries = function () {
        return undefined;
    };
    ServiceSectionService.prototype.loadSettings = function () {
        return undefined;
    };
    ServiceSectionService.prototype.loadOverview = function () {
        return undefined;
    };
    return ServiceSectionService;
}(abstract_section_service_ng_1.AbstractSectionService));
exports.ServiceSectionService = ServiceSectionService;
