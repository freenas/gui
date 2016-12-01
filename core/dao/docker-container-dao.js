"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var DockerContainerDao = (function (_super) {
    __extends(DockerContainerDao, _super);
    function DockerContainerDao() {
        return _super.call(this, abstract_dao_ng_1.AbstractDao.Model.DockerContainer) || this;
    }
    DockerContainerDao.getInstance = function () {
        if (!DockerContainerDao.instance) {
            DockerContainerDao.instance = new DockerContainerDao();
        }
        return DockerContainerDao.instance;
    };
    DockerContainerDao.prototype.requestInteractiveConsole = function (containerId) {
        return this.middlewareClient.callRpcMethod('docker.container.request_interactive_console', [containerId]);
    };
    DockerContainerDao.prototype.requestSerialConsole = function (containerId) {
        return this.middlewareClient.callRpcMethod('docker.container.request_serial_console', [containerId]);
    };
    return DockerContainerDao;
}(abstract_dao_ng_1.AbstractDao));
exports.DockerContainerDao = DockerContainerDao;
