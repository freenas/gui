"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var ShellDao = (function (_super) {
    __extends(ShellDao, _super);
    function ShellDao() {
        return _super.call(this, {}, {
            queryMethod: 'shell.get_shells'
        }) || this;
    }
    ShellDao.getInstance = function () {
        if (!ShellDao.instance) {
            ShellDao.instance = new ShellDao();
        }
        return ShellDao.instance;
    };
    ShellDao.prototype.spawn = function (columns, lines) {
        return this.middlewareClient.callRpcMethod('shell.spawn', ['/usr/local/bin/cli', columns, lines]);
    };
    return ShellDao;
}(abstract_dao_ng_1.AbstractDao));
exports.ShellDao = ShellDao;
