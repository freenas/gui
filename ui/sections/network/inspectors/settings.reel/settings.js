var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require('lodash');

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

            this._deletedHosts = [];
            this._deletedRoutes = [];
            if (isFirstTime) {
                this._snapshotDHCPSettingsIfNecessary();
            }
        }
    },

    revert: {
        value: function() {
            var self = this;
            _.concat(this.object.settings.hosts, this._deletedHosts);
            this._deletedHosts = [];
            _.concat(this.object.settings.routes, this._deletedRoutes);
            this._deletedRoutes = [];
            return self._sectionService.revertSettings().then(function() {
                return self._snapshotDHCPSettingsIfNecessary();
            });
        }
    },

    save: {
        value: function() {
            var self = this,
                dhcpChanged = this._checkIfDHCPSettingsChanged();
            return Promise.all(_.flatten(
                _.concat(
                    [self._sectionService.saveSettings(self.object.settings)],
                    _.map(this._deletedHosts, function(host) {
                        return self._sectionService.deleteHost(host);
                    }),
                    _.map(this.object.settings.hosts, function(host) {
                        return self._sectionService.saveHost(host);
                    }),
                    _.map(this._deletedRoutes, function(route) {
                        return self._sectionService.deleteStaticRoute(route);
                    }),
                    _.map(this.object.settings.routes, function(route) {
                        return self._sectionService.saveStaticRoute(route);
                    })
                )
            )).then(function() {
                self._deletedHosts = [];
                self._deletedRoutes = [];
                if (dhcpChanged) {
                    self._snapshotDHCPSettingsIfNecessary();
                    return self._sectionService.renewLease();
                }
            });
        }
    },

    markHostAsDeleted: {
        value: function(host) {
            this._deletedHosts.push(host);
        }
    },

    markRouteAsDeleted: {
        value: function(route) {
            this._deletedRoutes.push(route);
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
