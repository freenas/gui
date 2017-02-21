var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Units = require('core/Units'),
    RoutingService = require("core/service/routing-service").RoutingService;

exports.ContainerCreator = AbstractInspector.specialize({

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;

            this.memoryUnits = Units.MEGABYTE_SIZES;
            this._environment = {};
            this._routingService = RoutingService.getInstance();

            return Promise.all([
                this._sectionService.listDockerHosts(),
                this._sectionService.listDockerNetworks(),
                this._sectionService.getPrimaryNetWorkModes()
            ]).spread(function (hostDockers, networks, primaryNetWorkModes) {
                self._hostDockers = hostDockers;
                self._networks = networks;
                self.primaryNetWorkModes = primaryNetWorkModes;
            });
        }
    },

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                if (object) {
                    this._object = object;
                } else {
                    this._object = null;
                }
            }
        },
        get: function () {
            return this._object;
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super(isFirstTime);
            var self = this;
            this._reset();

            if (isFirstTime) {
                this.addEventListener("action", this);
            }

            if (!this._loadDataPromise) {
                this.isLoading = true;

                this._loadDataPromise = this._sectionService.getDockerSettings()
                .then(function (dockerSettings) {
                    self._dockerSettings = dockerSettings;
                }).finally(function () {
                    self.isLoading = false;
                    self._loadDataPromise = null;
                });
            }
        }
    },

    handleGenerateAction: {
        value: function () {
            var self = this;
            this._sectionService.generateMacAddress().then(function(macAddress) {
                self.object.bridge.macaddress = macAddress;
            });
        }
    },

    exitDocument: {
        value: function () {
            this.super();
            self._loadDataPromise = null;
        }
    },

    _reset: {
        value: function () {
            if (this._environment) {
                this._environment.clear();
            }

            if (this._volumesComponent.values) {
                this._volumesComponent.values.clear();
            }

            if (this._portsComponent.values) {
                this._portsComponent.values.clear();
            }

            if (this._environmentComponent.values) {
                this._environmentComponent.values.clear();
            }

            this._nameComponent.value = null;
            this._commandComponent.value = null;
        }
    },

    save: {
        value: function () {
            return this._sectionService.saveContainer(this.object, {
                command: this._commandComponent.value,
                environments: this._environmentComponent.values,
                settings: this._settingsComponent.values,
                ports: this._portsComponent.values,
                volumes: this._volumesComponent.values,
            }).then(function () {
                self._reset();
            });
        }
    }

});
