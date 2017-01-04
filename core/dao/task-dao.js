"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var TaskDao = (function (_super) {
    __extends(TaskDao, _super);
    function TaskDao() {
        return _super.call(this, model_1.Model.Task) || this;
    }
    TaskDao.prototype.submit = function (name, args) {
        if (args === void 0) { args = []; }
        return this.middlewareClient.submitTask(name, args);
    };
    return TaskDao;
}(abstract_dao_1.AbstractDao));
exports.TaskDao = TaskDao;
