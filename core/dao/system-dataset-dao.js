"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var SystemDatasetDao = (function (_super) {
    __extends(SystemDatasetDao, _super);
    function SystemDatasetDao() {
        return _super.call(this, {}, {
            typeName: 'SystemDataset',
            queryMethod: 'system_dataset.status'
        }) || this;
    }
    SystemDatasetDao.getInstance = function () {
        if (!SystemDatasetDao.instance) {
            SystemDatasetDao.instance = new SystemDatasetDao();
        }
        return SystemDatasetDao.instance;
    };
    return SystemDatasetDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SystemDatasetDao = SystemDatasetDao;
