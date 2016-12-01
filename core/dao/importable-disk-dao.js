"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var ImportableDiskDao = (function (_super) {
    __extends(ImportableDiskDao, _super);
    function ImportableDiskDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.ImportableDisk, {
            queryMethod: 'volume.find_media'
        }) || this;
    }
    ImportableDiskDao.getInstance = function () {
        if (!ImportableDiskDao.instance) {
            ImportableDiskDao.instance = new ImportableDiskDao();
        }
        return ImportableDiskDao.instance;
    };
    return ImportableDiskDao;
}(abstract_dao_ng_1.AbstractDao));
exports.ImportableDiskDao = ImportableDiskDao;
