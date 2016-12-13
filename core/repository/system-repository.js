"use strict";
var system_general_dao_1 = require("../dao/system-general-dao");
var system_time_dao_1 = require("../dao/system-time-dao");
var system_dataset_dao_1 = require("../dao/system-dataset-dao");
var system_device_dao_1 = require("../dao/system-device-dao");
var system_section_dao_1 = require("../dao/system-section-dao");
var SystemRepository = (function () {
    function SystemRepository(systemGeneralDao, systemTimeDao, systemDatasetDao, systemDeviceDao, systemSectionDao) {
        this.systemGeneralDao = systemGeneralDao;
        this.systemTimeDao = systemTimeDao;
        this.systemDatasetDao = systemDatasetDao;
        this.systemDeviceDao = systemDeviceDao;
        this.systemSectionDao = systemSectionDao;
    }
    SystemRepository.getInstance = function () {
        if (!SystemRepository.instance) {
            SystemRepository.instance = new SystemRepository(new system_general_dao_1.SystemGeneralDao(), new system_time_dao_1.SystemTimeDao(), new system_dataset_dao_1.SystemDatasetDao(), new system_device_dao_1.SystemDeviceDao(), new system_section_dao_1.SystemSectionDao());
        }
        return SystemRepository.instance;
    };
    SystemRepository.prototype.getGeneral = function () {
        return this.systemGeneralDao.get();
    };
    SystemRepository.prototype.getTime = function () {
        return this.systemTimeDao.get();
    };
    SystemRepository.prototype.getDataset = function () {
        return this.systemDatasetDao.list();
    };
    SystemRepository.prototype.getDevices = function (deviceClass) {
        return this.systemDeviceDao.getDevices(deviceClass);
    };
    SystemRepository.prototype.listSystemSections = function () {
        return this.systemSectionDao.list();
    };
    SystemRepository.prototype.listTimezones = function () {
        return this.systemGeneralDao.listTimezones();
    };
    SystemRepository.prototype.listKeymaps = function () {
        return this.systemGeneralDao.listKeymaps();
    };
    return SystemRepository;
}());
exports.SystemRepository = SystemRepository;
