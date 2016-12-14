"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var model_event_name_1 = require("../model-event-name");
var immutable_1 = require("immutable");
var task_dao_1 = require("../dao/task-dao");
var Promise = require("bluebird");
var TaskRepository = (function (_super) {
    __extends(TaskRepository, _super);
    function TaskRepository(taskDao) {
        _super.call(this, [
            'Task'
        ]);
        this.taskDao = taskDao;
        this.taskPromises = immutable_1.Map();
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
    TaskRepository.prototype.getTaskPromise = function (taskId) {
        return this.taskPromises.get(taskId);
    };
    TaskRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'Task':
                var self_1 = this;
                this.tasks = this.dispatchModelEvents(this.tasks, model_event_name_1.ModelEventName.Task, state);
                this.tasks.forEach(function (task) {
                    var taskId = task.get('id');
                    if (self_1.taskPromises.has(taskId)) {
                        var deferred = self_1.taskPromises.get(taskId);
                        if (task.state === 'FINISHED') {
                            deferred.resolve(task);
                        }
                        else if (task.state == 'FAILED') {
                            deferred.reject(task);
                        }
                    }
                    else {
                        self_1.taskPromises.set(taskId, self_1.defer());
                    }
                });
                break;
            default:
                break;
        }
    };
    TaskRepository.prototype.handleEvent = function (name, data) {
    };
    TaskRepository.prototype.defer = function () {
        var resolve, reject, promise = new Promise(function () {
            resolve = arguments[0];
            reject = arguments[1];
        });
        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        };
    };
    return TaskRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.TaskRepository = TaskRepository;
