"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var NetworkInterfaceVlanPropertiesDao = (function (_super) {
    __extends(NetworkInterfaceVlanPropertiesDao, _super);
    function NetworkInterfaceVlanPropertiesDao() {
        _super.call(this, 'NetworkInterfaceVlanProperties');
    }
    return NetworkInterfaceVlanPropertiesDao;
}(abstract_dao_1.AbstractDao));
exports.NetworkInterfaceVlanPropertiesDao = NetworkInterfaceVlanPropertiesDao;
