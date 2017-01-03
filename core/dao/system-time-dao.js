"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require('./abstract-dao');
var SystemTimeDao = (function (_super) {
    __extends(SystemTimeDao, _super);
    function SystemTimeDao() {
        _super.call(this, 'SystemTime', {
            queryMethod: 'system.time.get_config',
            preventQueryCaching: true
        });
    }
    return SystemTimeDao;
}(abstract_dao_1.AbstractDao));
exports.SystemTimeDao = SystemTimeDao;
