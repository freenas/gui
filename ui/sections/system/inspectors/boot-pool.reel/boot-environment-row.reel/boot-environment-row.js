var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    _ = require('lodash');

exports.BootEnvironmentRow = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function() {
            if (this.object) {
                this._changeListener = this._eventDispatcherService.addEventListener(ModelEventName.BootEnvironment.change(this.object._stableId), this.handleObjectChange.bind(this));
            }
        }
    },

    exitDocument: {
        value: function() {
            if (this.object) {
                this._eventDispatcherService.removeEventListener(ModelEventName.BootEnvironment.change(this.object._stableId), this._changeListener);
            }
        }
    },

    handleKeepToggleAction: {
        value: function(event) {
            this.saveChanges();
            event.stopPropagation();
        }
    },

    handleAction: {
        value: function (event) {
            if(event.detail && event.detail.get('eventName') == 'textValueChanged') {
                var self = this;
                this.saveChanges().then(function() {
                    self._eventDispatcherService.removeEventListener(ModelEventName.BootEnvironment.change(self.object.id), self._changeListener);
                    self._changeListener = self._eventDispatcherService.addEventListener(ModelEventName.BootEnvironment.change(self.object.id), self.handleObjectChange.bind(self));
                });
                event.stopPropagation();
            }
        }
    },

    saveChanges: {
        value: function() {
            var self = this;
            this.object._isLocked = true;
            return this.service.saveBootEnvironment(this.object).then(function(submittedTask) {
                return submittedTask.taskPromise;
            }).finally(function() {
                self.object._isLocked = false;
            });
        }
    },

    handleObjectChange: {
        value: function(state) {
            if (!this.object._isLocked) {
                _.assign(this.object, state.toJS());
            }
        }
    }
});
