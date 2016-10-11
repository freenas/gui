/**
 * @module ui/container-creator.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class ContainerCreator
 * @extends Component
 */
exports.ContainerCreator = AbstractInspector.specialize(/** @lends ContainerCreator# */ {
    
    templateDidLoad: {
        value: function () {
            var self = this,
                promises = [];

            this._environment = {};
            this._canDrawGate.setField("serviceLoaded", false);

            promises.push(this._sectionService.listTemplateDockerImages());
            promises.push(this._sectionService.listDockerHosts());

            Promise.all(promises).then(function (data) {
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
                    var dockerHostName = dockerHost.name;
                    
                    return {
                        label: dockerHostName,
                        value: dockerHostName
                    };
                });

                self._canDrawGate.setField("serviceLoaded", true);
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
            }
        }
    },

    _getPortsFromArray: {
        value: function (array) {
            var ports = null,
                string = array.join(" "),
                error;

            if (string) {
                var data = string.split(/:|\/| /),
                    port, containerPort, hostPort;

                ports = [];

                for (var i = 0, length = data.length; i + 3 <= length; i = i + 3) {
                    ports.push({ 
                        container_port: +data[i],
                        host_port: +data[i + 1],
                        protocol: data[i + 2].toUpperCase()
                    });
                }
            }

            return ports;
        }
    },

    _getEnvironmentVariableFromArray: {
        value: function (array) {
            var env = null,
                string = array.join(" ");

            if (string) {
                var data = string.split(/ |=/);
                env = this._environment;

                for (var i = 0, length = data.length; i + 2 <= length; i = i + 2) {
                    env[data[i]] = data[i + 1];
                }
            }

            return env;
        }
    },

    save: {
        value: function () {
            var environmentComponentValues = this._environmentComponent.values,
                commandString = this._commandComponent.value,
                namesString = this._nameComponent.value,
                portsValues = this._portsComponent.values,
                spaceString = " ",
                self = this;

            if (commandString) {
                this.object.command = commandString.split(spaceString);
            }

            if (namesString) {
                if (Array.isArray(this.object.names)) {
                    this.object.names[0] = namesString;
                } else {
                    this.object.names = [namesString];
                }
            }

            if (this.object.parent_directory === "/") {
                this.object.parent_directory = void 0;
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

            return this.application.dataService.saveDataObject(this.object).then(function () {
                self._reset();
            });
        }
    }

});
