"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var SupportCategoryDao = (function (_super) {
    __extends(SupportCategoryDao, _super);
    function SupportCategoryDao() {
        _super.call(this, 'SupportCategory', {
            queryMethod: 'support.categories_no_auth'
        });
    }
    return SupportCategoryDao;
}(abstract_dao_1.AbstractDao));
exports.SupportCategoryDao = SupportCategoryDao;
