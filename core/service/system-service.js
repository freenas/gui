"use strict";
var system_repository_1 = require("core/repository/system-repository");
var middleware_client_1 = require("core/service/middleware-client");
var SystemService = (function () {
    function SystemService(systemRepository, middlewareClient) {
        this.systemRepository = systemRepository;
        this.middlewareClient = middlewareClient;
    }
    SystemService.getInstance = function () {
        if (!SystemService.instance) {
            SystemService.instance = new SystemService(system_repository_1.SystemRepository.getInstance(), middleware_client_1.MiddlewareClient.getInstance());
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
    return SystemService;
}());
exports.SystemService = SystemService;
