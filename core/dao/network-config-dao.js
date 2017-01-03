"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var NetworkConfigDao = (function (_super) {
    __extends(NetworkConfigDao, _super);
    function NetworkConfigDao() {
        _super.call(this, 'NetworkConfig', {
            queryMethod: 'network.config.get_config'
        });
    }
    NetworkConfigDao.prototype.getMyIps = function () {
        return this.middlewareClient.callRpcMethod('network.config.get_my_ips');
    };
    return NetworkConfigDao;
}(abstract_dao_1.AbstractDao));
exports.NetworkConfigDao = NetworkConfigDao;
