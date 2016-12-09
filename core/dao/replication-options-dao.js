"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var ReplicationOptionsDao = (function (_super) {
    __extends(ReplicationOptionsDao, _super);
    function ReplicationOptionsDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.ReplicationOptions) || this;
    }
    ReplicationOptionsDao.getInstance = function () {
        if (!ReplicationOptionsDao.instance) {
            ReplicationOptionsDao.instance = new ReplicationOptionsDao();
        }
        return ReplicationOptionsDao.instance;
    };
    return ReplicationOptionsDao;
}(abstract_dao_ng_1.AbstractDao));
exports.ReplicationOptionsDao = ReplicationOptionsDao;
