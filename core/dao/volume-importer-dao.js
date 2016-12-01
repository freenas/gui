"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var VolumeImporterDao = (function (_super) {
    __extends(VolumeImporterDao, _super);
    function VolumeImporterDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.VolumeImporter) || this;
    }
    VolumeImporterDao.getInstance = function () {
        if (!VolumeImporterDao.instance) {
            VolumeImporterDao.instance = new VolumeImporterDao();
        }
        return VolumeImporterDao.instance;
    };
    return VolumeImporterDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VolumeImporterDao = VolumeImporterDao;
