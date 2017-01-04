"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var SupportCategoryDao = (function (_super) {
    __extends(SupportCategoryDao, _super);
    function SupportCategoryDao() {
        return _super.call(this, model_1.Model.SupportCategory, {
            queryMethod: 'support.categories_no_auth'
        }) || this;
    }
    return SupportCategoryDao;
}(abstract_dao_1.AbstractDao));
exports.SupportCategoryDao = SupportCategoryDao;
