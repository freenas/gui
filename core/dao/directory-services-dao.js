"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var DirectoryServicesDao = (function (_super) {
    __extends(DirectoryServicesDao, _super);
    function DirectoryServicesDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.DirectoryServices, {
            queryMethod: 'directory.query'
        }) || this;
    }
    DirectoryServicesDao.getInstance = function () {
        if (!DirectoryServicesDao.instance) {
            DirectoryServicesDao.instance = new DirectoryServicesDao();
        }
        return DirectoryServicesDao.instance;
    };
    return DirectoryServicesDao;
}(abstract_dao_ng_1.AbstractDao));
exports.DirectoryServicesDao = DirectoryServicesDao;
