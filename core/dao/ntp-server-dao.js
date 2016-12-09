"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var NtpServerDao = (function (_super) {
    __extends(NtpServerDao, _super);
    function NtpServerDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.NtpServer, {
            queryMethod: 'ntp_server.query'
        }) || this;
    }
    NtpServerDao.getInstance = function () {
        if (!NtpServerDao.instance) {
            NtpServerDao.instance = new NtpServerDao();
        }
        return NtpServerDao.instance;
    };
    NtpServerDao.prototype.syncNow = function (serverAddress) {
        return this.middlewareClient.submitTask('ntp_server.sync_now', [serverAddress]);
    };
    return NtpServerDao;
}(abstract_dao_ng_1.AbstractDao));
exports.NtpServerDao = NtpServerDao;
