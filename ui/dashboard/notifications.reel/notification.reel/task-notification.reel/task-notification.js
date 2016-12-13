var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    _ = require("lodash");

exports.TaskNotification = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function() {
            var displayedDate = this.object.started_at || this.object.created_at;
            this.object.startDate = new Date(displayedDate.$date);
            this._eventDispatcherService.addEventListener(ModelEventName.Task.change(this.object.id), this._handleChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.Task.change(this.object.id), this._handleChange.bind(this));
        }
    },

    _handleChange: {
        value: function(state) {
            _.assign(this.object, state.toJS());
        }
    }
});
