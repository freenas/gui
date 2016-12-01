"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var SectionDao = (function (_super) {
    __extends(SectionDao, _super);
    function SectionDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.Section) || this;
    }
    SectionDao.getInstance = function () {
        if (!SectionDao.instance) {
            SectionDao.instance = new SectionDao();
        }
        return SectionDao.instance;
    };
    return SectionDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SectionDao = SectionDao;
