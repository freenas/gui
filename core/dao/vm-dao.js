"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var VmDao = (function (_super) {
    __extends(VmDao, _super);
    function VmDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.Vm) || this;
    }
    VmDao.getInstance = function () {
        if (!VmDao.instance) {
            VmDao.instance = new VmDao();
        }
        return VmDao.instance;
    };
    VmDao.prototype.requestSerialConsole = function (vmId) {
        return this.middlewareClient.callRpcMethod('vm.request_serial_console', [vmId]);
    };
    VmDao.prototype.getHardwareCapabilities = function () {
        return this.middlewareClient.callRpcMethod("vm.get_hw_vm_capabilities");
    };
    return VmDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VmDao = VmDao;
