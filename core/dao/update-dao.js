"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var UpdateDao = (function (_super) {
    __extends(UpdateDao, _super);
    function UpdateDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.Update, {
            queryMethod: 'update.get_config'
        }) || this;
    }
    UpdateDao.getInstance = function () {
        if (!UpdateDao.instance) {
            UpdateDao.instance = new UpdateDao();
        }
        return UpdateDao.instance;
    };
    return UpdateDao;
}(abstract_dao_ng_1.AbstractDao));
exports.UpdateDao = UpdateDao;
