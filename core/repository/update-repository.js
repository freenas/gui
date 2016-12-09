"use strict";
var update_dao_1 = require("../dao/update-dao");
var UpdateRepository = (function () {
    function UpdateRepository(updateDao) {
        this.updateDao = updateDao;
    }
    UpdateRepository.getInstance = function () {
        if (!UpdateRepository.instance) {
            UpdateRepository.instance = new UpdateRepository(update_dao_1.UpdateDao.getInstance());
        }
        return UpdateRepository.instance;
    };
    UpdateRepository.prototype.getConfig = function () {
        return this.updateDao.getConfig();
    };
    UpdateRepository.prototype.getTrains = function () {
    };
    return UpdateRepository;
}());
exports.UpdateRepository = UpdateRepository;
