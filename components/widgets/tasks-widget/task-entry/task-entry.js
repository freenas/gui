///<reference path="../bower_components/polymer-ts/polymer-ts.d.ts"/>
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
var event_dispatcher_service_1 = require("core/service/event-dispatcher-service");
var _ = require("lodash");
var TaskEntry = TaskEntry_1 = (function (_super) {
    __extends(TaskEntry, _super);
    function TaskEntry() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.properties = {
            task: {
                value: null
            }
        };
        return _this;
    }
    TaskEntry.prototype.created = function () {
        this.eventDispatcherService = event_dispatcher_service_1.EventDispatcherService.getInstance();
    };
    TaskEntry.prototype.attached = function () {
        this.listener = this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Task.change(this.task.id), this.handleTaskChange.bind(this));
    };
    TaskEntry.prototype.detached = function () {
        this.eventDispatcherService.removeEventListener(model_event_name_1.ModelEventName.Task.change(this.task.id), this.listener);
    };
    TaskEntry.prototype.handleTaskChange = function (state) {
        this.task = state.toJS();
        this.set('hasDescription', !!(this.task.error || (this.task.warnings && this.task.warnings.length)));
        this.$.progress.value = TaskEntry_1.getProgress(this.task);
        var stateClass = TaskEntry_1.getStateClass(this.task);
        if (this.stateClass !== stateClass) {
            this.stateClass = stateClass;
            this.$.progress.updateStyles();
        }
    };
    TaskEntry.getStateClass = function (task) {
        var stateClass = '';
        switch (task.state) {
            case 'FINISHED':
                stateClass = task.warnings.length ? 'has-warning' : 'has-success';
                break;
            case 'FAILED':
                stateClass = 'has-error';
                break;
        }
        return stateClass;
    };
    TaskEntry.getProgress = function (task) {
        return _.includes(['FINISHED', 'FAILED'], task.state) ?
            100 :
            task.progress.percentage || 0;
    };
    TaskEntry.prototype.handleExpand = function (event) {
        event.currentTarget.parentElement.classList.toggle('is-expanded');
    };
    return TaskEntry;
}(polymer.Base));
TaskEntry = TaskEntry_1 = __decorate([
    component('task-entry')
], TaskEntry);
TaskEntry.register();
var TaskEntry_1;
