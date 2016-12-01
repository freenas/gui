"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var SystemGeneralDao = (function (_super) {
    __extends(SystemGeneralDao, _super);
    function SystemGeneralDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.SystemGeneral, {
            queryMethod: 'system.general.get_config'
        }) || this;
    }
    SystemGeneralDao.getInstance = function () {
        if (!SystemGeneralDao.instance) {
            SystemGeneralDao.instance = new SystemGeneralDao();
        }
        return SystemGeneralDao.instance;
    };
    return SystemGeneralDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SystemGeneralDao = SystemGeneralDao;
