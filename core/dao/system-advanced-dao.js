"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var cleaner_1 = require("../service/data-processor/cleaner");
var diff_1 = require("../service/data-processor/diff");
var null_1 = require("../service/data-processor/null");
var model_1 = require("../model");
var SystemAdvancedDao = (function (_super) {
    __extends(SystemAdvancedDao, _super);
    function SystemAdvancedDao() {
        return _super.call(this, model_1.Model.SystemAdvanced, {
            queryMethod: 'system.advanced.get_config',
            createMethod: 'system.advanced.update'
        }) || this;
    }
    SystemAdvancedDao.prototype.save = function (object, args) {
        var update = null_1.processor.process(diff_1.processor.process(cleaner_1.processor.process(object, this.propertyDescriptors), 'SystemAdvanced', object.id));
        if (update || (args && args.length > 0)) {
            return this.middlewareClient.submitTask('system.advanced.update', [update]);
        }
    };
    return SystemAdvancedDao;
}(abstract_dao_1.AbstractDao));
exports.SystemAdvancedDao = SystemAdvancedDao;
