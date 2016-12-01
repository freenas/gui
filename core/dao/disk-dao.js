"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var DiskDao = (function (_super) {
    __extends(DiskDao, _super);
    function DiskDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.Disk) || this;
    }
    DiskDao.getInstance = function () {
        if (!DiskDao.instance) {
            DiskDao.instance = new DiskDao();
        }
        return DiskDao.instance;
    };
    return DiskDao;
}(abstract_dao_ng_1.AbstractDao));
exports.DiskDao = DiskDao;
