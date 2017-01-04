"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var VmReadmeDao = (function (_super) {
    __extends(VmReadmeDao, _super);
    function VmReadmeDao() {
        return _super.call(this, model_1.Model.VmReadme) || this;
    }
    return VmReadmeDao;
}(abstract_dao_1.AbstractDao));
exports.VmReadmeDao = VmReadmeDao;
