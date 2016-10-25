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
            var environmentComponentValues = this._environmentComponent.values,
                commandString = this._commandComponent.value,
                namesString = this._nameComponent.value,
                portsValues = this._portsComponent.values,
                volumesValues = this._volumesComponent.values,
                self = this;

            if (commandString) {
                this.object.command = commandString.split(" ");
            }

            if (namesString) {
                if (Array.isArray(this.object.names)) {
                    this.object.names[0] = namesString;
                } else {
                    this.object.names = [namesString];
                }
            }

            if (this.object.memory_limit) {
                var memoryLimit = this.application.bytesService.convertStringToSize(this.object.memory_limit, this.application.bytesService.UNITS.M);
                this.object.memory_limit = memoryLimit || void 0;
            }

            if (environmentComponentValues && environmentComponentValues.length) {
                this.object.environment = environmentComponentValues.filter(function (entry) {
                    return entry.variable && entry.value;
                }).map(function (entry) {
                    return entry.variable + "=" + entry.value;
                });
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
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
