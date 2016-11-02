var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    NetworkRoute = require('core/model/models/network-route').NetworkRoute,
    Model = require("core/model/model").Model,
    NotificationCenterModule = require("core/backend/notification-center");

exports.Settings = AbstractInspector.specialize({

    _controllers: {
        value: null
    },

    controllers: {
        get: function() {
            return this._controllers;
        },
        set: function(controllers) {
            if (this._controllers !== controllers) {
                this._controllers = controllers;
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();

            if (isFirstTime) {
                this._dataService = this.application.dataService;
                return this._performActionOnControllers('initialize', [this._sectionService, this._dataService]);
            }
        }
    },
    
    revert: {
        value: function() {
            var self = this;
            return this._performActionOnControllers('revert')
                .then(function() {
                    self._sectionService.revertSettings();
                });
        }
    },

    save: {
        value: function() {
            var self = this;
            return this._performActionOnControllers('save')
                .then(function(){
                    self._sectionService.saveSettings();
                });
        }
    },

    _performActionOnControllers: {
        value: function(action, args) {
            var promises = [];
            for (var key in this.controllers) {
                var controller = this.controllers[key];
                promises.push(controller[action].apply(controller, args));
            }
            return Promise.all(promises);
        }
    }
});
