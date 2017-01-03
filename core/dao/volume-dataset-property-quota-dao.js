"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var VolumeDatasetPropertyQuotaDao = (function (_super) {
    __extends(VolumeDatasetPropertyQuotaDao, _super);
    function VolumeDatasetPropertyQuotaDao() {
        _super.call(this, 'VolumeDatasetPropertyQuota');
    }
    return VolumeDatasetPropertyQuotaDao;
}(abstract_dao_1.AbstractDao));
exports.VolumeDatasetPropertyQuotaDao = VolumeDatasetPropertyQuotaDao;
