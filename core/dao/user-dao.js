"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var UserDao = (function (_super) {
    __extends(UserDao, _super);
    function UserDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.User) || this;
    }
    UserDao.getInstance = function () {
        if (!UserDao.instance) {
            UserDao.instance = new UserDao();
        }
        return UserDao.instance;
    };
    return UserDao;
}(abstract_dao_ng_1.AbstractDao));
exports.UserDao = UserDao;
