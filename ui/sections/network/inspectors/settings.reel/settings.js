var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

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
                return this._performActionOnControllers('initialize', this._sectionService);
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
        value: function(action) {
            var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [],
                promises = [];
            console.log('action', args);
            for (var key in this.controllers) {
                var controller = this.controllers[key];
                promises.push(controller[action].apply(controller, args));
            }
            return Promise.all(promises);
        }
    }
});
