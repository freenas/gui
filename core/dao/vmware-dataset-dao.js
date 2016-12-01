"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var VmwareDatasetDao = (function (_super) {
    __extends(VmwareDatasetDao, _super);
    function VmwareDatasetDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.VmwareDataset) || this;
    }
    VmwareDatasetDao.getInstance = function () {
        if (!VmwareDatasetDao.instance) {
            VmwareDatasetDao.instance = new VmwareDatasetDao();
        }
        return VmwareDatasetDao.instance;
    };
    return VmwareDatasetDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VmwareDatasetDao = VmwareDatasetDao;
