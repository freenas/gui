/**
 * @module ui/container-creator.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class ContainerCreator
 * @extends Component
 */
exports.ContainerCreator = AbstractInspector.specialize(/** @lends ContainerCreator# */ {
    
    //Method used by docker-image-pull.reel
    templateDidLoad: {
        value: function () {
            var self = this,
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;
                promises = [];

            this._environment = {};
            this._canDrawGate.setField(blockGateKey, false);

            promises.push(this._sectionService.listTemplateDockerImages());
            promises.push(this._sectionService.listDockerHosts());

            return Promise.all(promises).then(function (data) {
                var templates = data[0],
                    templatesNames = Object.keys(templates);

                self._templates = templates;
                self._images = templatesNames.map(function (x) {
                    return {
                        label: x,
                        value: templates[x].image
                    };
                });
                self._availablesDockers = data[1].map(function (dockerHost) {                    
                    return {
                        label: dockerHost.name,
                        value: dockerHost.id
                    };
                });
            }).finally(function () {
                self._canDrawGate.setField(blockGateKey, true);
            });
        }
    },

    enterDocument: {
        value: function (firsTime) {
            this.super();
            this._reset();

            if (firsTime) {
                this.addPathChangeListener("_imageComponent.selectedValue", this, "_handleImageChange");
            }
        }  
    },

    _handleImageChange: {
        value: function (value) {
            var selectedImageKey = null;

            if (typeof value === "string") {
                var images = this._images;

                for (var i = 0, length = images.length; i < length; i++) {
                    if (images[i].value === value) {
                        selectedImageKey = images[i].label;
                        break;
                    }
                }
            }
            
            this.selectedImageKey = selectedImageKey;
        }
    },

    _reset: {
        value: function () {
            if (this._environment) {
                this._environment.clear();
                
                if (this._volumesComponent.values) {
                    this._volumesComponent.values.clear();
                }
            }
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

            if (environmentComponentValues) {
                this.object.environment = environmentComponentValues;
            }

            if (portsValues.length) {
                this.object.ports = this._getPortsFromArray(portsValues);
            }

            if (volumesValues.length) {
                this.object.volumes = this._getVolumesFromArray(volumesValues);
            }

            return this._sectionService.saveContainer(this.object).then(function () {
                self._reset();
            });
        }
    },

    //@deprecated will be removed with the new Table UI
    _getPortsFromArray: {
        value: function (array) {
            var regEx = new RegExp(/^([0-9]+) -> ([0-9]+) (TCP|UDP)$/),
                ports = null;

            if (array && array.length) {
                ports = [];

                for (var i = 0, length = array.length; i < length; i++) {
                    data = array[0].match(regEx);

                    if (data.length === 4) {
                        ports.push({
                            host_port: +data[1],
                            container_port: +data[2],
                            protocol: data[3].toUpperCase()
                        });
                    }
                }
            }               

            return ports;
        }
    },

    //@deprecated will be removed with the new Table UI
    _getVolumesFromArray: {
        value: function (array) {
            var regEx = new RegExp(/^([^ ]+) -> ([^ ]+) ?(\(ro\))?$/),
                ports = null;

            if (array && array.length) {
                ports = [];

                for (var i = 0, length = array.length; i < length; i++) {
                    data = array[0].match(regEx);

                    if (data.length >= 3) {
                        ports.push({
                            host_path: data[1],
                            container_path: data[2],
                            readonly: !!data[3]
                        });
                    }
                }
            }               

            return ports;
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
