"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var cleaner_1 = require("../service/data-processor/cleaner");
var diff_1 = require("../service/data-processor/diff");
var null_1 = require("../service/data-processor/null");
var SystemUiDao = (function (_super) {
    __extends(SystemUiDao, _super);
    function SystemUiDao() {
        return _super.call(this, 'SystemUi', {
            queryMethod: 'system.ui.get_config'
        }) || this;
    }
    SystemUiDao.prototype.save = function (object, args) {
        var update = null_1.processor.process(diff_1.processor.process(cleaner_1.processor.process(object, this.propertyDescriptors), 'SystemUi', object.id));
        if (update || (args && args.length > 0)) {
            return this.middlewareClient.submitTask('system.ui.update', [update]);
        }
    };
    return SystemUiDao;
}(abstract_dao_ng_1.AbstractDao));
exports.SystemUiDao = SystemUiDao;
