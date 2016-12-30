"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require('./abstract-dao-ng');
var UserDao = (function (_super) {
    __extends(UserDao, _super);
    function UserDao() {
        _super.call(this, 'User');
    }
    UserDao.prototype.getNextUid = function () {
        return this.middlewareClient.callRpcMethod('user.next_uid');
    };
    return UserDao;
}(abstract_dao_ng_1.AbstractDao));
exports.UserDao = UserDao;
