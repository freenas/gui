"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var UnixPermissionsDao = (function (_super) {
    __extends(UnixPermissionsDao, _super);
    function UnixPermissionsDao() {
        return _super.call(this, model_1.Model.UnixPermissions) || this;
    }
    UnixPermissionsDao.prototype.getNewInstance = function () {
        return abstract_dao_1.AbstractDao.prototype.getNewInstance.call(this).then(function (permissions) {
            permissions.user = {};
            permissions.group = {};
            permissions.others = {};
            return permissions;
        });
    };
    return UnixPermissionsDao;
}(abstract_dao_1.AbstractDao));
exports.UnixPermissionsDao = UnixPermissionsDao;
