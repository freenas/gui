"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var boot_pool_dao_1 = require("../dao/boot-pool-dao");
var boot_environment_dao_1 = require("../dao/boot-environment-dao");
var BootPoolRepository = (function (_super) {
    __extends(BootPoolRepository, _super);
    function BootPoolRepository(bootPoolDao, bootEnvironmentDao) {
        var _this = _super.call(this, [
            'BootEnvironment'
        ]) || this;
        _this.bootPoolDao = bootPoolDao;
        _this.bootEnvironmentDao = bootEnvironmentDao;
        return _this;
    }
    BootPoolRepository.getInstance = function () {
        if (!BootPoolRepository.instance) {
            BootPoolRepository.instance = new BootPoolRepository(boot_pool_dao_1.BootPoolDao.getInstance(), boot_environment_dao_1.BootEnvironmentDao.getInstance());
        }
        return BootPoolRepository.instance;
    };
    BootPoolRepository.prototype.getBootPoolConfig = function () {
        return this.bootPoolDao.getConfig();
    };
    BootPoolRepository.prototype.listBootEnvironments = function () {
        return this.bootEnvironmentDao.list();
    };
    BootPoolRepository.prototype.deleteBootEnvironment = function (bootEnvironment) {
        return this.bootEnvironmentDao.delete(bootEnvironment);
    };
    BootPoolRepository.prototype.scrubBootPool = function () {
        return this.bootPoolDao.scrub();
    };
    BootPoolRepository.prototype.activateBootEnvironment = function (bootEnvironment) {
        return this.bootEnvironmentDao.activate(bootEnvironment);
    };
    BootPoolRepository.prototype.saveBootEnvironment = function (bootEnvironment) {
        return this.bootEnvironmentDao.save(bootEnvironment);
    };
    BootPoolRepository.prototype.cloneBootEnvironment = function (bootEnvironment, cloneName) {
        return this.bootEnvironmentDao.clone(bootEnvironment, cloneName);
    };
    BootPoolRepository.prototype.handleStateChange = function (name, state) {
        var self = this;
        switch (name) {
            case 'BootEnvironment':
                this.eventDispatcherService.dispatch('bootEnvironmentsChange', state);
                state.forEach(function (bootEnvironment, id) {
                    if (!self.bootEnvironments || !self.bootEnvironments.has(id)) {
                        self.eventDispatcherService.dispatch('bootEnvironmentAdd.' + id, bootEnvironment);
                    }
                    else if (self.bootEnvironments.get(id) !== bootEnvironment) {
                        self.eventDispatcherService.dispatch('bootEnvironmentChange.' + id, bootEnvironment);
                    }
                });
                if (this.bootEnvironments) {
                    this.bootEnvironments.forEach(function (bootEnvironment, id) {
                        if (!state.has(id) || state.get(id) !== bootEnvironment) {
                            self.eventDispatcherService.dispatch('bootEnvironmentRemove.' + id, bootEnvironment);
                        }
                    });
                }
                this.bootEnvironments = state;
                break;
            default:
                break;
        }
    };
    return BootPoolRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.BootPoolRepository = BootPoolRepository;
