"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var NetworkConfigDao = (function (_super) {
    __extends(NetworkConfigDao, _super);
    function NetworkConfigDao() {
        return _super.call(this, model_1.Model.NetworkConfig, {
            queryMethod: 'network.config.get_config'
        }) || this;
    }
    NetworkConfigDao.prototype.getMyIps = function () {
        return this.middlewareClient.callRpcMethod('network.config.get_my_ips');
    };
    return NetworkConfigDao;
}(abstract_dao_1.AbstractDao));
exports.NetworkConfigDao = NetworkConfigDao;
