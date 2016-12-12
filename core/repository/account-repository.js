"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var user_dao_1 = require("../dao/user-dao");
var group_dao_1 = require("../dao/group-dao");
var directory_services_dao_1 = require("../dao/directory-services-dao");
var directoryservice_config_dao_1 = require("../dao/directoryservice-config-dao");
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var Promise = require("bluebird");
var directory_dao_1 = require("../dao/directory-dao");
var model_event_name_1 = require("../model-event-name");
var AccountRepository = (function (_super) {
    __extends(AccountRepository, _super);
    function AccountRepository(userDao, groupDao, directoryServiceDao, directoryserviceConfigDao, directoryDao) {
        var _this = _super.call(this, [
            'User',
            'Group',
            'Directory'
        ]) || this;
        _this.userDao = userDao;
        _this.groupDao = groupDao;
        _this.directoryServiceDao = directoryServiceDao;
        _this.directoryserviceConfigDao = directoryserviceConfigDao;
        _this.directoryDao = directoryDao;
        _this.DIRECTORY_TYPES_LABELS = {
            winbind: "Active Directory",
            freeipa: "FreeIPA",
            ldap: "LDAP",
            nis: "NIS"
        };
        return _this;
    }
    AccountRepository.getInstance = function () {
        if (!AccountRepository.instance) {
            AccountRepository.instance = new AccountRepository(user_dao_1.UserDao.getInstance(), group_dao_1.GroupDao.getInstance(), directory_services_dao_1.DirectoryServicesDao.getInstance(), directoryservice_config_dao_1.DirectoryserviceConfigDao.getInstance(), directory_dao_1.DirectoryDao.getInstance());
        }
        return AccountRepository.instance;
    };
    AccountRepository.prototype.listUsers = function () {
        return this.userDao.list();
    };
    AccountRepository.prototype.findUserWithName = function (name) {
        return this.userDao.findSingleEntry({ username: name });
    };
    AccountRepository.prototype.saveUser = function (user) {
        return this.userDao.save(user);
    };
    AccountRepository.prototype.listGroups = function () {
        return this.groups ? Promise.resolve(this.groups.toSet().toJS()) : this.groupDao.list();
    };
    AccountRepository.prototype.getNewDirectoryServices = function () {
        return this.directoryServiceDao.getNewInstance();
    };
    AccountRepository.prototype.getDirectoryServiceConfig = function () {
        return this.directoryserviceConfigDao.get();
    };
    AccountRepository.prototype.getNewDirectoryForType = function (type) {
        var self = this;
        return this.directoryDao.getNewInstance().then(function (directory) {
            directory.type = type;
            directory.parameters = { "%type": type + "-directory-params" };
            directory.label = self.DIRECTORY_TYPES_LABELS[type];
            return directory;
        });
    };
    AccountRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'User':
                this.users = this.dispatchModelEvents(this.users, model_event_name_1.ModelEventName.User, state);
                break;
            case 'Group':
                this.groups = this.dispatchModelEvents(this.groups, model_event_name_1.ModelEventName.Group, state);
                break;
            case 'Directory':
                this.directories = this.dispatchModelEvents(this.directories, model_event_name_1.ModelEventName.Directory, state);
                break;
            default:
                break;
        }
    };
    AccountRepository.prototype.handleEvent = function (name, data) {
    };
    return AccountRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.AccountRepository = AccountRepository;
