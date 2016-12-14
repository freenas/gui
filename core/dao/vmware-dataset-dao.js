"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require('./abstract-dao-ng');
var VmwareDatasetDao = (function (_super) {
    __extends(VmwareDatasetDao, _super);
    function VmwareDatasetDao() {
        _super.call(this, 'VmwareDataset');
    }
    return VmwareDatasetDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VmwareDatasetDao = VmwareDatasetDao;
