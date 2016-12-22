"use strict";
var system_repository_1 = require("../repository/system-repository");
var middleware_client_1 = require("./middleware-client");
var boot_pool_repository_1 = require("../repository/boot-pool-repository");
var network_repository_1 = require("core/repository/network-repository");
var SystemService = (function () {
    function SystemService(systemRepository, middlewareClient, bootPoolRepository, networkRepository) {
        this.systemRepository = systemRepository;
        this.middlewareClient = middlewareClient;
        this.bootPoolRepository = bootPoolRepository;
        this.networkRepository = networkRepository;
    }
    SystemService.getInstance = function () {
        if (!SystemService.instance) {
            SystemService.instance = new SystemService(system_repository_1.SystemRepository.getInstance(), middleware_client_1.MiddlewareClient.getInstance(), boot_pool_repository_1.BootPoolRepository.getInstance(), network_repository_1.NetworkRepository.instance);
        }
        return SystemService.instance;
    };
    SystemService.prototype.changeBootPool = function (bootPool) {
        return this.middlewareClient.submitTask('system_dataset.migrate', [bootPool]);
    };
    SystemService.prototype.reboot = function () {
        return this.middlewareClient.submitTask('system.reboot');
    };
    SystemService.prototype.shutdown = function () {
        return this.middlewareClient.submitTask('system.shutdown');
    };
    SystemService.prototype.getVersion = function () {
        return this.middlewareClient.callRpcMethod('system.info.version');
    };
    SystemService.prototype.getHardware = function () {
        return this.middlewareClient.callRpcMethod('system.info.hardware');
    };
    SystemService.prototype.getUname = function () {
        return this.middlewareClient.callRpcMethod('system.info.uname_full');
    };
    SystemService.prototype.getLoad = function () {
        return this.middlewareClient.callRpcMethod('system.info.load_avg');
    };
    SystemService.prototype.getTime = function () {
        return this.systemRepository.getTime();
    };
    SystemService.prototype.getGeneral = function () {
        return this.systemRepository.getGeneral();
    };
    SystemService.prototype.getConfigFileAddress = function () {
        return this.systemRepository.getConfigFileAddress();
    };
    SystemService.prototype.restoreFactorySettings = function () {
        return this.systemRepository.restoreFactorySettings();
    };
    SystemService.prototype.restoreDatabase = function (file) {
        return this.systemRepository.restoreDatabase(file);
    };
    SystemService.prototype.getAdvanced = function () {
        return this.systemRepository.getAdvanced();
    };
    SystemService.prototype.getBootPoolConfig = function () {
        return this.bootPoolRepository.getBootPoolConfig();
    };
    SystemService.prototype.getSystemDatasetPool = function () {
        return this.systemRepository.getDataset();
    };
    SystemService.prototype.saveGeneral = function (general) {
        return this.systemRepository.saveGeneral(general);
    };
    SystemService.prototype.saveAdvanced = function (advanced) {
        return this.systemRepository.saveAdvanced(advanced);
    };
    SystemService.prototype.getUi = function () {
        return this.systemRepository.getUi();
    };
    SystemService.prototype.saveUi = function (ui) {
        return this.systemRepository.saveUi(ui);
    };
    SystemService.prototype.getMyIps = function () {
        return this.networkRepository.getMyIps();
    };
    SystemService.prototype.getDevices = function (deviceClass) {
        return this.systemRepository.getDevices(deviceClass);
    };
    SystemService.prototype.getDebugFileAddress = function () {
        return this.systemRepository.getDebugFileAddress();
    };
    return SystemService;
}());
exports.SystemService = SystemService;
