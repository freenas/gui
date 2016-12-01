"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var EncryptedVolumeActionsDao = (function (_super) {
    __extends(EncryptedVolumeActionsDao, _super);
    function EncryptedVolumeActionsDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.EncryptedVolumeActions) || this;
    }
    EncryptedVolumeActionsDao.getInstance = function () {
        if (!EncryptedVolumeActionsDao.instance) {
            EncryptedVolumeActionsDao.instance = new EncryptedVolumeActionsDao();
        }
        return EncryptedVolumeActionsDao.instance;
    };
    return EncryptedVolumeActionsDao;
}(abstract_dao_ng_1.AbstractDao));
exports.EncryptedVolumeActionsDao = EncryptedVolumeActionsDao;
