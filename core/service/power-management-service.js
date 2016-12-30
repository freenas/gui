"use strict";
var service_repository_1 = require("../repository/service-repository");
var PowerManagementService = (function () {
    function PowerManagementService(serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
    PowerManagementService.getInstance = function () {
        if (!PowerManagementService.instance) {
            PowerManagementService.instance = new PowerManagementService(service_repository_1.ServiceRepository.getInstance());
        }
        return PowerManagementService.instance;
    };
    PowerManagementService.prototype.listDrivers = function () {
        return this.serviceRepository.listUpsDrivers();
    };
    PowerManagementService.prototype.listUsbDevices = function () {
        return this.serviceRepository.listUpsUsbDevices();
    };
    return PowerManagementService;
}());
exports.PowerManagementService = PowerManagementService;
