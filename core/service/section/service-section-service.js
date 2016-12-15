"use strict";
var system_repository_1 = require("../../repository/system-repository");
var service_repository_1 = require("../../repository/service-repository");
// TODO: inherit from AbstractSectionService
var ServiceSectionService = (function () {
    function ServiceSectionService() {
        this.init();
    }
    ServiceSectionService.prototype.init = function () {
        this.systemRepository = system_repository_1.SystemRepository.getInstance();
        this.serviceRepository = service_repository_1.ServiceRepository.getInstance();
    };
    ServiceSectionService.prototype.getSystemGeneral = function () {
        return this.systemRepository.getGeneral();
    };
    ServiceSectionService.prototype.saveService = function (service) {
        return this.serviceRepository.saveService(service);
    };
    return ServiceSectionService;
}());
exports.ServiceSectionService = ServiceSectionService;
