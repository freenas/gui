"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var SystemInfoDao = (function (_super) {
    __extends(SystemInfoDao, _super);
    function SystemInfoDao() {
        return _super.call(this, '') || this;
    }
    SystemInfoDao.prototype.version = function () {
        return this.middlewareClient.callRpcMethod('system.info.version');
    };
    return SystemInfoDao;
}(abstract_dao_1.AbstractDao));
exports.SystemInfoDao = SystemInfoDao;
