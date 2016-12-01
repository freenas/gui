"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var KerberosKeytabDao = (function (_super) {
    __extends(KerberosKeytabDao, _super);
    function KerberosKeytabDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.KerberosKeytab) || this;
    }
    KerberosKeytabDao.getInstance = function () {
        if (!KerberosKeytabDao.instance) {
            KerberosKeytabDao.instance = new KerberosKeytabDao();
        }
        return KerberosKeytabDao.instance;
    };
    return KerberosKeytabDao;
}(abstract_dao_ng_1.AbstractDao));
exports.KerberosKeytabDao = KerberosKeytabDao;
