var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

exports.Settings = AbstractInspector.specialize({

    DHCP_RELATED_PROPERTIES: {
        value: ['dhcp', 'dns', 'gateway']
    },

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
                this._snapshotDHCPSettingsIfNecessary();
                return this._performActionOnControllers('initialize', this._sectionService);
            }
        }
    },
    
    revert: {
        value: function() {
            var self = this;
            return this._performActionOnControllers('revert').then(function() {
                return self._sectionService.revertSettings();
            }).then(function() {
                return self._snapshotDHCPSettingsIfNecessary();
            });
        }
    },

    save: {
        value: function() {
            var self = this,
                dhcpChanged = this._checkIfDHCPSettingsChanged();

            return this._performActionOnControllers('save').then(function(){
                return self._sectionService.saveSettings();
            }).then(function() {
                if (dhcpChanged) {
                    self._snapshotDHCPSettingsIfNecessary();
                    return self._sectionService.renewLease();
                }
            });
        }
    },

    _performActionOnControllers: {
        value: function(action) {
            var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [],
                promises = [];

            for (var key in this.controllers) {
                var controller = this.controllers[key];
                promises.push(controller[action].apply(controller, args));
            }

            return Promise.all(promises);
        }
    },

    _snapshotDHCPSettingsIfNecessary: {
        value: function() {
            if (this.object.settings.config) {
                this.object._config = {};
                for (var i = 0; i < this.DHCP_RELATED_PROPERTIES.length; i++) {
                    var field = this.DHCP_RELATED_PROPERTIES[i];
                    this.object._config[field] = Object.clone(this.object.settings.config[field]);
                }
            }
        }
    },

    _checkIfDHCPSettingsChanged: {
        value: function() {
            if (this.object.settings.config && this.object._config) {
                for (var i = 0; i < this.DHCP_RELATED_PROPERTIES.length; i++) {
                    var field = this.DHCP_RELATED_PROPERTIES[i];
                    if (!Object.equals(this.object.settings.config[field], this.object._config[field])) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
});
