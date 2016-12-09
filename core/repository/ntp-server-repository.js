"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var ntp_server_dao_1 = require("core/dao/ntp-server-dao");
var model_event_name_1 = require("../model-event-name");
var NtpServerRepository = (function (_super) {
    __extends(NtpServerRepository, _super);
    function NtpServerRepository(ntpServerDao) {
        var _this = _super.call(this, ['NtpServer']) || this;
        _this.ntpServerDao = ntpServerDao;
        return _this;
    }
    NtpServerRepository.getInstance = function () {
        if (!NtpServerRepository.instance) {
            NtpServerRepository.instance = new NtpServerRepository(ntp_server_dao_1.NtpServerDao.getInstance());
        }
        return NtpServerRepository.instance;
    };
    NtpServerRepository.prototype.listNtpServers = function () {
        return this.ntpServers ? this.ntpServers.toJS() : this.ntpServerDao.list();
    };
    NtpServerRepository.prototype.syncNow = function (serverAddress) {
        return this.ntpServerDao.syncNow(serverAddress);
    };
    NtpServerRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'NtpServer':
                this.ntpServers = this.dispatchModelEvents(this.ntpServers, model_event_name_1.ModelEventName.NtpServer, state);
                break;
            default:
                break;
        }
    };
    NtpServerRepository.prototype.handleEvent = function (name, data) {
    };
    return NtpServerRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.NtpServerRepository = NtpServerRepository;
