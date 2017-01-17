///<reference path="../bower_components/polymer-ts/polymer-ts.d.ts"/>

import {ModelEventName} from 'core/model-event-name';
import {EventDispatcherService} from 'core/service/event-dispatcher-service';
import * as _ from 'lodash';

@component('task-entry')
class TaskEntry extends polymer.Base {
    private task: any;
    private listener: Function;
    private stateClass: string;
    private hasDescription: boolean;

    public properties = {
        task: {
            value: null
        }
    };

    private eventDispatcherService: EventDispatcherService;

    public created() {
        this.eventDispatcherService = EventDispatcherService.getInstance();
    }

    public attached() {
        this.listener = this.eventDispatcherService.addEventListener(ModelEventName.Task.change(this.task.id), this.handleTaskChange.bind(this));
    }

    public detached() {
        this.eventDispatcherService.removeEventListener(ModelEventName.Task.change(this.task.id), this.listener);
    }

    private handleTaskChange(state) {
        this.task = state.toJS();
        this.set('hasDescription', !!(this.task.error || (this.task.warnings && this.task.warnings.length)));
        this.$.progress.value = TaskEntry.getProgress(this.task);
        let stateClass = TaskEntry.getStateClass(this.task);
        if (this.stateClass !== stateClass) {
            this.stateClass = stateClass;
            this.$.progress.updateStyles();
        }
    }

    private static getStateClass(task: any) {
        let stateClass = '';
        switch (task.state) {
            case 'FINISHED':
                stateClass = task.warnings.length ? 'has-warning' : 'has-success';
                break;
            case 'FAILED':
                stateClass = 'has-error';
                break;
        }
        return stateClass;
    }

    private static getProgress(task: any) {
        return _.includes(['FINISHED', 'FAILED'], task.state) ?
                    100 :
                    task.progress.percentage || 0;
    }

    private handleExpand(event) {
        // FIXME: use this.root ?
        event.currentTarget.parentElement.classList.toggle('is-expanded');
    }
}

TaskEntry.register();
