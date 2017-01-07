"use strict";
var update_repository_1 = require("../repository/update-repository");
var UpdateService = (function () {
    function UpdateService(updateRepository) {
        this.updateRepository = updateRepository;
    }
    UpdateService.getInstance = function () {
        if (!UpdateService.instance) {
            UpdateService.instance = new UpdateService(update_repository_1.UpdateRepository.getInstance());
        }
        return UpdateService.instance;
    };
    UpdateService.prototype.getConfig = function () {
        return this.updateRepository.getConfig();
    };
    UpdateService.prototype.saveConfig = function (config) {
        return this.updateRepository.saveConfig(config);
    };
    UpdateService.prototype.getTrains = function () {
        return this.updateRepository.getTrains();
    };
    UpdateService.prototype.getInfo = function () {
        return this.updateRepository.getInfo();
    };
    UpdateService.prototype.check = function () {
        return this.updateRepository.check();
    };
    UpdateService.prototype.checkAndDownload = function () {
        return this.updateRepository.checkAndDownload();
    };
    UpdateService.prototype.updateNow = function (reboot) {
        return this.updateRepository.updateNow(reboot);
    };
    UpdateService.prototype.apply = function (reboot) {
        return this.updateRepository.apply(reboot);
    };
    return UpdateService;
}());
exports.UpdateService = UpdateService;
