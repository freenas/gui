"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require('./abstract-dao-ng');
var VmTemplateDao = (function (_super) {
    __extends(VmTemplateDao, _super);
    function VmTemplateDao() {
        _super.call(this, 'Vm', {
            queryMethod: 'vm.template.query'
        });
    }
    return VmTemplateDao;
}(abstract_dao_ng_1.AbstractDao));
exports.VmTemplateDao = VmTemplateDao;
