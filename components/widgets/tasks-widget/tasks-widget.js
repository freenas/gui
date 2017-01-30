///<reference path="bower_components/polymer-ts/polymer-ts.d.ts"/>
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var model_event_name_1 = require("core/model-event-name");
var dashboard_service_1 = require("core/service/dashboard-service");
var task_service_1 = require("core/service/task-service");
var event_dispatcher_service_1 = require("core/service/event-dispatcher-service");
var _ = require("lodash");
var TasksWidget = (function (_super) {
    __extends(TasksWidget, _super);
    function TasksWidget() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TasksWidget.prototype.created = function () {
        this.dashboardService = dashboard_service_1.DashboardService.getInstance();
        this.taskService = task_service_1.TaskService.getInstance();
        this.eventDispatcherService = event_dispatcher_service_1.EventDispatcherService.getInstance();
    };
    TasksWidget.prototype.ready = function () {
        this.dashboardService.registerToTasks();
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Task.add, this.handleTaskAdd.bind(this));
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Task.remove, this.handleTaskRemove.bind(this));
        this.tasks = [];
    };
    TasksWidget.prototype.handleTaskAdd = function (task) {
        this.unshift('tasks', task.toJS());
    };
    TasksWidget.prototype.handleTaskRemove = function (task) {
        this.splice('tasks', _.findIndex(this.tasks, { id: task.get('id') }), 1);
    };
    return TasksWidget;
}(polymer.Base));
TasksWidget = __decorate([
    component('tasks-widget')
], TasksWidget);
TasksWidget.register();
