"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var BootPoolDao = (function (_super) {
    __extends(BootPoolDao, _super);
    function BootPoolDao() {
        return _super.call(this, {}, {
            typeName: 'BootPoolConfig'
        }) || this;
    }
    BootPoolDao.getInstance = function () {
        if (!BootPoolDao.instance) {
            BootPoolDao.instance = new BootPoolDao();
        }
        return BootPoolDao.instance;
    };
    BootPoolDao.prototype.getConfig = function () {
        return this.middlewareClient.callRpcMethod('boot.pool.get_config');
    };
    BootPoolDao.prototype.scrub = function () {
        return this.middlewareClient.callRpcMethod('boot.pool.scrub');
    };
    return BootPoolDao;
}(abstract_dao_ng_1.AbstractDao));
exports.BootPoolDao = BootPoolDao;
