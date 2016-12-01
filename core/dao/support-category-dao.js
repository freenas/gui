"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var SupportCategoryDao = (function (_super) {
    __extends(SupportCategoryDao, _super);
    function SupportCategoryDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.SupportCategory, {
            queryMethod: 'support.categories_no_auth'
        }) || this;
    }
    SupportCategoryDao.getInstance = function () {
        if (!SupportCategoryDao.instance) {
            SupportCategoryDao.instance = new SupportCategoryDao();
        }
        return SupportCategoryDao.instance;
    };
    return SupportCategoryDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SupportCategoryDao = SupportCategoryDao;
