"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require('./abstract-repository-ng');
var shell_dao_1 = require('core/dao/shell-dao');
var ShellRepository = (function (_super) {
    __extends(ShellRepository, _super);
    function ShellRepository(shellDao) {
        _super.call(this);
        this.shellDao = shellDao;
    }
    ShellRepository.getInstance = function () {
        if (!ShellRepository.instance) {
            ShellRepository.instance = new ShellRepository(new shell_dao_1.ShellDao());
        }
        return ShellRepository.instance;
    };
    ShellRepository.prototype.listShells = function () {
        var self = this;
        return this.shells ? Promise.resolve(this.shells) : this.shellDao.list().then(function (shells) { return self.shells = shells; });
    };
    ShellRepository.prototype.spawn = function (columns, lines) {
        columns = columns || 80;
        lines = lines || 24;
        return this.shellDao.spawn(columns, lines);
    };
    return ShellRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.ShellRepository = ShellRepository;
