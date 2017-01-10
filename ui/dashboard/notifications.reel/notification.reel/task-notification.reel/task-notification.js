var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    TaskService = require("core/service/task-service").TaskService,
    _ = require("lodash");

exports.TaskNotification = Component.specialize({
    constructor: {
        value: function() {
            this.eventDispatcherService = EventDispatcherService.getInstance();
            this.taskService = TaskService.getInstance();
        }
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            var self = this;
            this._object = object;
            this.availableDisksEventListener = this.eventDispatcherService.addEventListener(ModelEventName.Task.change(this.object.id), this._handleChange.bind(this));
            this.taskService.getTask(this.object.id).then(function(task) {
                _.assign(self.object, task);
            });
        }
    },

    enterDocument: {
        value: function() {
            var displayedDate = this.object.started_at || this.object.created_at;
            this.object.startDate = new Date(displayedDate.$date);
        }
    },

    _unregisterUpdates: {
        value: function () {
            this.eventDispatcherService.removeEventListener(ModelEventName.Task.change(this.object.id), this.availableDisksEventListener);
        }
    },

    exitDocument: {
        value: function() {
            this._unregisterUpdates();
        }
    },

    _handleChange: {
        value: function(state) {
            _.assign(this.object, state.toJS());
            if (this.object.state === 'FINISHED' || this.object.state === 'FAILED') {
                var self = this;
                this.object.progress.percentage = 100;
                if (this.object.state === 'FINISHED') {
                    setTimeout(function() {
                        self.isExpired = true;
                    }, 2000);
                }
                this._unregisterUpdates();
            }
        }
    }
}, {
    DRAW_GATE_FIELD: {
        value: 'objectRefreshed'
    }
});
