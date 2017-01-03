"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var DockerContainerDao = (function (_super) {
    __extends(DockerContainerDao, _super);
    function DockerContainerDao() {
        _super.call(this, 'DockerContainer');
    }
    DockerContainerDao.prototype.requestInteractiveConsole = function (containerId) {
        return this.middlewareClient.callRpcMethod('docker.container.request_interactive_console', [containerId]);
    };
    DockerContainerDao.prototype.requestSerialConsole = function (containerId) {
        return this.middlewareClient.callRpcMethod('docker.container.request_serial_console', [containerId]);
    };
    return DockerContainerDao;
}(abstract_dao_1.AbstractDao));
exports.DockerContainerDao = DockerContainerDao;
