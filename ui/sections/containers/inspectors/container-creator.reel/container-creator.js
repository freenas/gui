/**
 * @module ui/container-creator.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class ContainerCreator
 * @extends Component
 */
exports.ContainerCreator = AbstractInspector.specialize(/** @lends ContainerCreator# */ {
    
    templateDidLoad: {
        value: function () {
            var self = this,
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;

            this._environment = {};
            this._canDrawGate.setField(blockGateKey, false);

            return this._sectionService.listDockerHosts().then(function (hostDockers) {                
                self._hostDockers = hostDockers;
            }).finally(function () {
                self._canDrawGate.setField(blockGateKey, true);
            });
        }
    },

    enterDocument: {
        value: function (firsTime) {
            this.super();
            this._reset();

            if (!this._getDefaultDockerCollectionPromise) {
                var self = this;
                this.isLoading = true;

                this._getDefaultDockerCollectionPromise = this._sectionService.getDefaultDockerCollection()
                .then(function (defaultCollection) {
                    self.defaultCollection = defaultCollection;
                }).finally(function () {
                    self.isLoading = false;
                    self._getDefaultDockerCollectionPromise = null;
                });
            }
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

            this._commandComponent.value = null;
        }
    },

    save: {
        value: function () {
            var environmentComponentValues = this._environmentComponent.values,
                commandString = this._commandComponent.value,
                portsValues = this._portsComponent.values,
                volumesValues = this._volumesComponent.values,
                settingsValues = this._settingsComponent.values,
                environments = [],
                self = this;

            if (commandString) {
                this.object.command = commandString.split(" ");
            }

            if (this.object.memory_limit) {
                var memoryLimit = this.application.bytesService.convertStringToSize(this.object.memory_limit, this.application.bytesService.UNITS.M);
                this.object.memory_limit = memoryLimit || void 0;
            }

            if (settingsValues && settingsValues.length) {
                try {
                    environments = this._getVariablesFromArray(settingsValues);
                } catch (e) {
                    //TODO
                }
            }

            if (environmentComponentValues && environmentComponentValues.length) {
                environments = environments.concat(this._getVariablesFromArray(environmentComponentValues));
            }

            if (environments.length) {
                this.object.environement = environments;
            }

            if (portsValues && portsValues.length) {
                this.object.ports = portsValues.filter(function (entry) {
                    return entry.host_port && entry.container_port;
                });
            }

            if (volumesValues && volumesValues.length) {
                this.object.volumes = volumesValues.filter(function (entry) {
                    return entry.host_path && entry.container_path;
                });
            }

            return this._sectionService.saveContainer(this.object).then(function () {
                self._reset();
            });
        }
    },

    _getVariablesFromArray: {
        value: function (array) {
            return array.filter(function (entry) {
                var shouldKeep = entry.variable && entry.value;

                if (!shouldKeep && entry.optional !== void 0 && entry.optional === true) {
                    throw new Error("missing setting");
                }

                return shouldKeep;
            }).map(function (entry) {
                return entry.variable + "=" + entry.value;
            });
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
