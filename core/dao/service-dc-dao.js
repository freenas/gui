"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var ServiceDcDao = (function (_super) {
    __extends(ServiceDcDao, _super);
    function ServiceDcDao() {
        return _super.call(this, model_1.Model.ServiceDc, { queryMethod: 'service.dc.get_config' }) || this;
    }
    ServiceDcDao.prototype.provideDcIp = function () {
        return this.middlewareClient.callRpcMethod('service.dc.provide_dc_ip');
    };
    ServiceDcDao.prototype.provideDcUrl = function () {
        return this.middlewareClient.callRpcMethod('service.dc.provide_dc_url');
    };
    return ServiceDcDao;
}(abstract_dao_1.AbstractDao));
exports.ServiceDcDao = ServiceDcDao;
