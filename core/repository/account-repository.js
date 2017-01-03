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
        _super.call(this, [
            'User',
            'Group',
            'Directory'
        ]);
        this.userDao = userDao;
        this.groupDao = groupDao;
        this.directoryServiceDao = directoryServiceDao;
        this.directoryserviceConfigDao = directoryserviceConfigDao;
        this.directoryDao = directoryDao;
    }
    AccountRepository.getInstance = function () {
        if (!AccountRepository.instance) {
            AccountRepository.instance = new AccountRepository(new user_dao_1.UserDao(), new group_dao_1.GroupDao(), new directory_services_dao_1.DirectoryServicesDao(), new directoryservice_config_dao_1.DirectoryserviceConfigDao(), new directory_dao_1.DirectoryDao());
        }
        return AccountRepository.instance;
    };
    AccountRepository.prototype.loadUsers = function () {
        return this.userDao.list();
    };
    AccountRepository.prototype.loadGroups = function () {
        return this.groupDao.list();
    };
    AccountRepository.prototype.listUsers = function () {
        return this.users ? Promise.resolve(this.users.toSet().toJS()) : this.userDao.list();
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
    AccountRepository.prototype.getNextUid = function () {
        return this.userDao.getNextUid();
    };
    AccountRepository.prototype.getNewUser = function () {
        return this.userDao.getNewInstance();
    };
    AccountRepository.prototype.getNewGroup = function () {
        return this.groupDao.getNewInstance();
    };
    AccountRepository.prototype.getNewDirectoryServices = function () {
        return this.directoryServiceDao.getNewInstance();
    };
    AccountRepository.prototype.getDirectoryServiceConfig = function () {
        return this.directoryserviceConfigDao.get();
    };
    AccountRepository.prototype.listDirectories = function () {
        return this.directories ? Promise.resolve(this.directories.toSet().toJS()) : this.directoryDao.list();
    };
    AccountRepository.prototype.getNewDirectoryForType = function (type) {
        return this.directoryDao.getNewInstance().then(function (directory) {
            directory.type = type;
            directory._tmpId = type;
            directory.parameters = { "%type": type + "-directory-params" };
            directory.label = AccountRepository.DIRECTORY_TYPES_LABELS[type];
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
    AccountRepository.DIRECTORY_TYPES_LABELS = {
        winbind: "Active Directory",
        ldap: "LDAP",
        nis: "NIS"
    };
    return AccountRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.AccountRepository = AccountRepository;
