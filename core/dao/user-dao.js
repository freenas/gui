"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var UserDao = (function (_super) {
    __extends(UserDao, _super);
    function UserDao() {
        _super.call(this, 'User');
    }
    UserDao.prototype.getNextUid = function () {
        return this.middlewareClient.callRpcMethod('user.next_uid');
    };
    UserDao.prototype.delete = function (object, args) {
        return abstract_dao_1.AbstractDao.prototype.delete.call(this, object, [{
                delete_home_directory: !!args[0],
                delete_own_group: !!args[1]
            }]);
    };
    return UserDao;
}(abstract_dao_1.AbstractDao));
exports.UserDao = UserDao;
