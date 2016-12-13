"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var model_event_name_1 = require("../model-event-name");
var task_dao_1 = require("../dao/task-dao");
var TaskRepository = (function (_super) {
    __extends(TaskRepository, _super);
    function TaskRepository(taskDao) {
        var _this = _super.call(this, [
            'Task'
        ]) || this;
        _this.taskDao = taskDao;
        return _this;
    }
    TaskRepository.getInstance = function () {
        if (!TaskRepository.instance) {
            TaskRepository.instance = new TaskRepository(new task_dao_1.TaskDao());
        }
        return TaskRepository.instance;
    };
    TaskRepository.prototype.listTasks = function () {
        return this.taskDao.list();
    };
    TaskRepository.prototype.registerToTasks = function () {
        return this.taskDao.register();
    };
    TaskRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'Task':
                this.tasks = this.dispatchModelEvents(this.tasks, model_event_name_1.ModelEventName.Task, state);
                break;
            default:
                break;
        }
    };
    TaskRepository.prototype.handleEvent = function (name, data) {
    };
    return TaskRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.TaskRepository = TaskRepository;
