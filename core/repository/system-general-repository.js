"use strict";
var system_general_dao_1 = require("core/dao/system-general-dao");
var SystemGeneralRepository = (function () {
    function SystemGeneralRepository() {
        this.dao = system_general_dao_1.SystemGeneralDao.getInstance();
    }
    SystemGeneralRepository.getInstance = function () {
        if (!SystemGeneralRepository.instance) {
            SystemGeneralRepository.instance = new SystemGeneralRepository();
        }
        return SystemGeneralRepository.instance;
    };
    SystemGeneralRepository.prototype.getSystemGeneral = function () {
        return this.dao.get();
    };
    return SystemGeneralRepository;
}());
exports.SystemGeneralRepository = SystemGeneralRepository;
