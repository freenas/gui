"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var SystemDeviceDao = (function (_super) {
    __extends(SystemDeviceDao, _super);
    function SystemDeviceDao() {
        _super.call(this, {});
    }
    SystemDeviceDao.prototype.getDevices = function (deviceClass) {
        return this.middlewareClient.callRpcMethod('system.device.get_devices', [deviceClass]);
    };
    return SystemDeviceDao;
}(abstract_dao_1.AbstractDao));
exports.SystemDeviceDao = SystemDeviceDao;
