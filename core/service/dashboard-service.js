"use strict";
var alert_repository_1 = require("../repository/alert-repository");
var task_repository_1 = require("../repository/task-repository");
var DashboardService = (function () {
    function DashboardService(alertRepository, taskRepository) {
        this.alertRepository = alertRepository;
        this.taskRepository = taskRepository;
    }
    DashboardService.getInstance = function () {
        if (!DashboardService.instance) {
            DashboardService.instance = new DashboardService(alert_repository_1.AlertRepository.getInstance(), task_repository_1.TaskRepository.getInstance());
        }
        return DashboardService.instance;
    };
    DashboardService.prototype.listAlerts = function () {
        return this.alertRepository.listAlerts();
    };
    DashboardService.prototype.dismissAlert = function (alert) {
        return this.alertRepository.dismissAlert(alert);
    };
    DashboardService.prototype.registerToTasks = function () {
        return this.taskRepository.registerToTasks();
    };
    return DashboardService;
}());
exports.DashboardService = DashboardService;
