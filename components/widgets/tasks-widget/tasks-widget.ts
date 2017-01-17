///<reference path="../../../bower_components/polymer-ts/polymer-ts.d.ts"/>

import {ModelEventName} from 'core/model-event-name';
import {DashboardService} from 'core/service/dashboard-service';
import {TaskService} from 'core/service/task-service';
import {EventDispatcherService} from 'core/service/event-dispatcher-service';
import {Map} from 'immutable';
import * as _ from 'lodash';

@component('tasks-widget')
class TasksWidget extends polymer.Base {
    private taskService: TaskService;
    private dashboardService: DashboardService;
    private eventDispatcherService: EventDispatcherService;
    private tasks: Array<any>;

    public created() {
        this.dashboardService = DashboardService.getInstance();
        this.taskService = TaskService.getInstance();
        this.eventDispatcherService = EventDispatcherService.getInstance();
    }

    public ready() {
        this.dashboardService.registerToTasks();
        this.eventDispatcherService.addEventListener(ModelEventName.Task.add, this.handleTaskAdd.bind(this));
        this.eventDispatcherService.addEventListener(ModelEventName.Task.remove, this.handleTaskRemove.bind(this));
        this.tasks = [];
    }

    private handleTaskAdd(task: Map<string, any>) {
        this.unshift('tasks', task.toJS());
    }

    private handleTaskRemove(task: Map<string, any>) {
        this.splice('tasks', _.findIndex(this.tasks, {id: task.get('id')}), 1);
    }
}

TasksWidget.register();
