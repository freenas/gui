"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var share_dao_1 = require("../dao/share-dao");
var model_event_name_1 = require("../model-event-name");
var Promise = require("bluebird");
var model_1 = require("../model");
var permissions_dao_1 = require("../dao/permissions-dao");
var ShareRepository = (function (_super) {
    __extends(ShareRepository, _super);
    function ShareRepository(shareDao, permissionsDao) {
        var _this = _super.call(this, [model_1.Model.Share]) || this;
        _this.shareDao = shareDao;
        _this.permissionsDao = permissionsDao;
        return _this;
    }
    ShareRepository.getInstance = function () {
        if (!ShareRepository.instance) {
            ShareRepository.instance = new ShareRepository(new share_dao_1.ShareDao(), new permissions_dao_1.PermissionsDao());
        }
        return ShareRepository.instance;
    };
    ShareRepository.prototype.listShares = function () {
        return this.shares ? Promise.resolve(this.shares.valueSeq().toJS()) : this.shareDao.list();
    };
    ShareRepository.prototype.getNewShare = function (volume, shareType) {
        return this.shareDao.getNewInstance().then(function (share) {
            share._isNewObject = true;
            share._tmpId = shareType;
            share._volume = volume;
            share.type = shareType;
            share.enabled = true;
            share.description = '';
            return share;
        });
    };
    ShareRepository.prototype.saveShare = function (object, isServiceEnabled) {
        return this.shareDao.save(object, object._isNew ? [null, isServiceEnabled] : [isServiceEnabled]);
    };
    ShareRepository.prototype.getNewPermissions = function () {
        return this.permissionsDao.getNewInstance().then(function (permissions) {
            permissions.user = {};
            permissions.group = {};
            permissions.others = {};
            return permissions;
        });
    };
    ShareRepository.prototype.handleStateChange = function (name, state) {
        this.shares = this.dispatchModelEvents(this.shares, model_event_name_1.ModelEventName.Share, state);
    };
    ShareRepository.prototype.handleEvent = function (name, data) { };
    return ShareRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.ShareRepository = ShareRepository;
