"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var AlertFilterDao = (function (_super) {
    __extends(AlertFilterDao, _super);
    function AlertFilterDao() {
        _super.call(this, 'AlertFilter');
    }
    return AlertFilterDao;
}(abstract_dao_ng_1.AbstractDao));
exports.AlertFilterDao = AlertFilterDao;
