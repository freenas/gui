"use strict";
var task_repository_1 = require("core/repository/task-repository");
var TaskService = (function () {
    function TaskService(taskRepository) {
        this.taskRepository = taskRepository;
    }
    TaskService.getInstance = function () {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService(task_repository_1.TaskRepository.instance);
        }
        return TaskService.instance;
    };
    TaskService.prototype.loadEntries = function () {
        return this.taskRepository.listTasks();
    };
    TaskService.prototype.findTasks = function (filter) {
        return this.taskRepository.findTasks(filter);
    };
    return TaskService;
}());
exports.TaskService = TaskService;
