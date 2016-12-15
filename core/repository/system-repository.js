"use strict";
var system_general_dao_1 = require("../dao/system-general-dao");
var system_time_dao_1 = require("../dao/system-time-dao");
var system_dataset_dao_1 = require("../dao/system-dataset-dao");
var system_device_dao_1 = require("../dao/system-device-dao");
var system_section_dao_1 = require("../dao/system-section-dao");
var database_dao_1 = require("../dao/database-dao");
var system_advanced_dao_1 = require("../dao/system-advanced-dao");
var system_ui_dao_1 = require("../dao/system-ui-dao");
var SystemRepository = (function () {
    function SystemRepository(systemGeneralDao, systemTimeDao, systemDatasetDao, systemDeviceDao, systemSectionDao, databaseDao, systemAdvancedDao, systemUiDao) {
        this.systemGeneralDao = systemGeneralDao;
        this.systemTimeDao = systemTimeDao;
        this.systemDatasetDao = systemDatasetDao;
        this.systemDeviceDao = systemDeviceDao;
        this.systemSectionDao = systemSectionDao;
        this.databaseDao = databaseDao;
        this.systemAdvancedDao = systemAdvancedDao;
        this.systemUiDao = systemUiDao;
    }
    SystemRepository.getInstance = function () {
        if (!SystemRepository.instance) {
            SystemRepository.instance = new SystemRepository(new system_general_dao_1.SystemGeneralDao(), new system_time_dao_1.SystemTimeDao(), new system_dataset_dao_1.SystemDatasetDao(), new system_device_dao_1.SystemDeviceDao(), new system_section_dao_1.SystemSectionDao(), new database_dao_1.DatabaseDao(), new system_advanced_dao_1.SystemAdvancedDao(), new system_ui_dao_1.SystemUiDao());
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
        return this.systemDatasetDao.get();
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
    SystemRepository.prototype.getConfigFileAddress = function () {
        return this.databaseDao.dump('freenas10.db');
    };
    SystemRepository.prototype.restoreFactorySettings = function () {
        return this.databaseDao.factoryRestore();
    };
    SystemRepository.prototype.restoreDatabase = function (file) {
        return this.databaseDao.restore(file);
    };
    SystemRepository.prototype.getAdvanced = function () {
        return this.systemAdvancedDao.get();
    };
    SystemRepository.prototype.saveGeneral = function (general) {
        return this.systemGeneralDao.save(general);
    };
    SystemRepository.prototype.saveAdvanced = function (advanced) {
        return this.systemAdvancedDao.save(advanced);
    };
    SystemRepository.prototype.getTimezones = function () {
        return this.systemGeneralDao.listTimezones();
    };
    SystemRepository.prototype.getKeymaps = function () {
        return this.systemGeneralDao.listKeymaps();
    };
    SystemRepository.prototype.getUi = function () {
        return this.systemUiDao.get();
    };
    SystemRepository.prototype.saveUi = function (ui) {
        return this.systemUiDao.save(ui);
    };
    return SystemRepository;
}());
exports.SystemRepository = SystemRepository;
