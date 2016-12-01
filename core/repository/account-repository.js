"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var user_dao_1 = require("core/dao/user-dao");
var group_dao_1 = require("core/dao/group-dao");
var directory_services_dao_1 = require("../dao/directory-services-dao");
var directoryservice_config_dao_1 = require("../dao/directoryservice-config-dao");
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var shell_dao_1 = require("../dao/shell-dao");
var AccountRepository = (function (_super) {
    __extends(AccountRepository, _super);
    function AccountRepository(userDao, groupDao, directoryServiceDao, directoryserviceConfigDao, shellDao) {
        var _this = _super.call(this, [
            'User',
            'Group',
            'Directory'
        ]) || this;
        _this.userDao = userDao;
        _this.groupDao = groupDao;
        _this.directoryServiceDao = directoryServiceDao;
        _this.directoryserviceConfigDao = directoryserviceConfigDao;
        _this.shellDao = shellDao;
        return _this;
    }
    AccountRepository.getInstance = function () {
        if (!AccountRepository.instance) {
            AccountRepository.instance = new AccountRepository(user_dao_1.UserDao.getInstance(), group_dao_1.GroupDao.getInstance(), directory_services_dao_1.DirectoryServicesDao.getInstance(), directoryservice_config_dao_1.DirectoryserviceConfigDao.getInstance(), shell_dao_1.ShellDao.getInstance());
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
    AccountRepository.prototype.listDirectoryServices = function () {
        return this.directoryServiceDao.list();
    };
    AccountRepository.prototype.getNewDirectoryServices = function () {
        return this.directoryServiceDao.getNewInstance();
    };
    AccountRepository.prototype.getDirectoryServiceConfig = function () {
        return this.directoryserviceConfigDao.get();
    };
    AccountRepository.prototype.listShells = function () {
        return this.shellDao.list();
    };
    AccountRepository.prototype.handleStateChange = function (name, state) {
        var self = this;
        switch (name) {
            case 'User':
                this.eventDispatcherService.dispatch('usersChange', state);
                state.forEach(function (user, id) {
                    if (!self.users || !self.users.has(id)) {
                        self.eventDispatcherService.dispatch('userAdd.' + id, user);
                    }
                    else if (self.users.get(id) !== user) {
                        self.eventDispatcherService.dispatch('userChange.' + id, user);
                    }
                });
                if (this.users) {
                    this.users.forEach(function (user, id) {
                        if (!state.has(id) || state.get(id) !== user) {
                            self.eventDispatcherService.dispatch('userRemove.' + id, user);
                        }
                    });
                }
                this.users = state;
                break;
            case 'Group':
                this.eventDispatcherService.dispatch('groupsChange', state);
                state.forEach(function (group, id) {
                    if (!self.groups || !self.groups.has(id)) {
                        self.eventDispatcherService.dispatch('groupAdd.' + id, group);
                    }
                    else if (self.groups.get(id) !== group) {
                        self.eventDispatcherService.dispatch('groupChange.' + id, group);
                    }
                });
                if (this.groups) {
                    this.groups.forEach(function (group, id) {
                        if (!state.has(id) || state.get(id) !== group) {
                            self.eventDispatcherService.dispatch('groupRemove.' + id, group);
                        }
                    });
                }
                this.groups = state;
                break;
            case 'Directory':
                this.eventDispatcherService.dispatch('directoriesChange', state);
                state.forEach(function (directory, id) {
                    if (!self.directorys || !self.directorys.has(id)) {
                        self.eventDispatcherService.dispatch('directoryAdd.' + id, directory);
                    }
                    else if (self.directorys.get(id) !== directory) {
                        self.eventDispatcherService.dispatch('directoryChange.' + id, directory);
                    }
                });
                if (this.directorys) {
                    this.directorys.forEach(function (directory, id) {
                        if (!state.has(id) || state.get(id) !== directory) {
                            self.eventDispatcherService.dispatch('directoryRemove.' + id, directory);
                        }
                    });
                }
                this.directorys = state;
                break;
            default:
                break;
        }
    };
    return AccountRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.AccountRepository = AccountRepository;
