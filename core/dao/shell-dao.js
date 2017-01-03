"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var ShellDao = (function (_super) {
    __extends(ShellDao, _super);
    function ShellDao() {
        _super.call(this, {});
    }
    ShellDao.prototype.list = function () {
        return this.middlewareClient.callRpcMethod('shell.get_shells');
    };
    ShellDao.prototype.spawn = function (columns, lines) {
        return this.middlewareClient.callRpcMethod('shell.spawn', ['/usr/local/bin/cli', columns, lines]);
    };
    return ShellDao;
}(abstract_dao_1.AbstractDao));
exports.ShellDao = ShellDao;
