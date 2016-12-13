"use strict";
var alertRepository_1 = require("../repository/alertRepository");
var DashboardService = (function () {
    function DashboardService(alertRepository) {
        this.alertRepository = alertRepository;
    }
    DashboardService.getInstance = function () {
        if (!DashboardService.instance) {
            DashboardService.instance = new DashboardService(alertRepository_1.AlertRepository.getInstance());
        }
        return DashboardService.instance;
    };
    DashboardService.prototype.listAlerts = function () {
        return this.alertRepository.listAlerts();
    };
    DashboardService.prototype.dismissAlert = function (alert) {
        return this.alertRepository.dismissAlert(alert);
    };
    return DashboardService;
}());
exports.DashboardService = DashboardService;
