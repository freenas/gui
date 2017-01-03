"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var VolumeDatasetPropertyAtimeDao = (function (_super) {
    __extends(VolumeDatasetPropertyAtimeDao, _super);
    function VolumeDatasetPropertyAtimeDao() {
        _super.call(this, 'VolumeDatasetPropertyAtime');
    }
    return VolumeDatasetPropertyAtimeDao;
}(abstract_dao_1.AbstractDao));
exports.VolumeDatasetPropertyAtimeDao = VolumeDatasetPropertyAtimeDao;
