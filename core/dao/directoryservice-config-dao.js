"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var DirectoryserviceConfigDao = (function (_super) {
    __extends(DirectoryserviceConfigDao, _super);
    function DirectoryserviceConfigDao() {
        return _super.call(this, 'DirectoryserviceConfig', {
            queryMethod: 'directoryservice.get_config'
        }) || this;
    }
    return DirectoryserviceConfigDao;
}(abstract_dao_ng_1.AbstractDao));
exports.DirectoryserviceConfigDao = DirectoryserviceConfigDao;
