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
        return _super.call(this, 'Volume') || this;
    }
    VolumeDao.prototype.getDisksAllocation = function (diskIds) {
        return this.middlewareClient.callRpcMethod('volume.get_disks_allocation', [diskIds]);
    };
    VolumeDao.prototype.getAvailableDisks = function () {
        return this.middlewareClient.callRpcMethod('volume.get_available_disks');
    };
    VolumeDao.prototype.export = function (volume) {
        return this.middlewareClient.submitTask('volume.export', [volume.id]);
    };
    VolumeDao.prototype.lock = function (volume) {
        return this.middlewareClient.submitTask('volume.lock', [volume.id]);
    };
    VolumeDao.prototype.unlock = function (volume, password) {
        return this.middlewareClient.submitTask('volume.unlock', [volume.id, password]);
    };
    VolumeDao.prototype.rekey = function (volume, key, password) {
        return this.middlewareClient.submitTask('volume.rekey', [volume.id, !!key, password]);
    };
    VolumeDao.prototype.getVolumeKey = function (volume) {
        return this.middlewareClient.submitTaskWithDownload('volume.keys.backup', [volume.id, 'key_' + volume.id]);
    };
    VolumeDao.prototype.importEncrypted = function (name, disks, key, password) {
        return this.middlewareClient.submitTask('volume.import', [
            name,
            name,
            {},
            {
                key: key,
                disks: disks.map(function (x) { return x.path; })
            },
            password
        ]);
    };
    VolumeDao.prototype.scrub = function (volume) {
        return this.middlewareClient.submitTask('volume.scrub', [volume.id]);
    };
    return VolumeDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VolumeDao = VolumeDao;
