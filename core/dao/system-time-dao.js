"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var SystemTimeDao = (function (_super) {
    __extends(SystemTimeDao, _super);
    function SystemTimeDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.SystemTime, {
            queryMethod: 'system.time.get_config'
        }) || this;
    }
    SystemTimeDao.getInstance = function () {
        if (!SystemTimeDao.instance) {
            SystemTimeDao.instance = new SystemTimeDao();
        }
        return SystemTimeDao.instance;
    };
    return SystemTimeDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SystemTimeDao = SystemTimeDao;
