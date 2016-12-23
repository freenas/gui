"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var update_dao_1 = require("../dao/update-dao");
var UpdateRepository = (function (_super) {
    __extends(UpdateRepository, _super);
    function UpdateRepository(updateDao) {
        _super.call(this, ['Update']);
        this.updateDao = updateDao;
    }
    UpdateRepository.getInstance = function () {
        if (!UpdateRepository.instance) {
            UpdateRepository.instance = new UpdateRepository(new update_dao_1.UpdateDao());
        }
        return UpdateRepository.instance;
    };
    UpdateRepository.prototype.getConfig = function () {
        return this.updateDao.get();
    };
    UpdateRepository.prototype.saveConfig = function (config) {
        return this.updateDao.save(config);
    };
    UpdateRepository.prototype.getTrains = function () {
        return this.updateDao.trains();
    };
    UpdateRepository.prototype.getInfo = function () {
        return this.updateDao.updateInfo();
    };
    UpdateRepository.prototype.verify = function () {
        return this.updateDao.verify();
    };
    UpdateRepository.prototype.check = function () {
        return this.updateDao.check();
    };
    UpdateRepository.prototype.checkAndDownload = function () {
        return this.updateDao.checkfetch();
    };
    UpdateRepository.prototype.updateNow = function (reboot) {
        return this.updateDao.updatenow(reboot);
    };
    UpdateRepository.prototype.apply = function (reboot) {
        return this.updateDao.apply(reboot);
    };
    UpdateRepository.prototype.handleStateChange = function (name, data) { };
    UpdateRepository.prototype.handleEvent = function (name, data) { };
    return UpdateRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.UpdateRepository = UpdateRepository;
