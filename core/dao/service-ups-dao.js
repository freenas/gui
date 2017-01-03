"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var ServiceUpsDao = (function (_super) {
    __extends(ServiceUpsDao, _super);
    function ServiceUpsDao() {
        _super.call(this, 'ServiceUps', { queryMethod: 'service.ups.get_config' });
    }
    ServiceUpsDao.prototype.getDrivers = function () {
        return this.middlewareClient.callRpcMethod('service.ups.drivers');
    };
    ServiceUpsDao.prototype.getUsbDevices = function () {
        return this.middlewareClient.callRpcMethod('service.ups.get_usb_devices');
    };
    return ServiceUpsDao;
}(abstract_dao_1.AbstractDao));
exports.ServiceUpsDao = ServiceUpsDao;
