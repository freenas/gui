var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    _ = require("lodash");

exports.TaskNotification = Component.specialize({
    eventDispatcherService: {
        get: function() {
            if (!this._eventDispatcherService) {
                this._eventDispatcherService = EventDispatcherService.getInstance();
            }
            return this._eventDispatcherService;
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
            this._object = object;
            this.availableDisksEventListener = this.eventDispatcherService.addEventListener(ModelEventName.Task.change(this.object.id), this._handleChange.bind(this));
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
                this.object.progress.percentage = 100;
                this._unregisterUpdates();
            }
        }
    }
});
