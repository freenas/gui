"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var VolumeDao = (function (_super) {
    __extends(VolumeDao, _super);
    function VolumeDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.Volume) || this;
    }
    VolumeDao.getInstance = function () {
        if (!VolumeDao.instance) {
            VolumeDao.instance = new VolumeDao();
        }
        return VolumeDao.instance;
    };
    VolumeDao.prototype.getDisksAllocation = function (diskIds) {
        return this.middlewareClient.callRpcMethod('volume.get_disks_allocation', [diskIds]);
    };
    VolumeDao.prototype.getAvailableDisks = function () {
        return this.middlewareClient.callRpcMethod('volume.get_available_disks');
    };
    return VolumeDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VolumeDao = VolumeDao;
