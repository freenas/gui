/**
 * @module ui/container.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Container
 * @extends Component
 */
exports.Container = Component.specialize(/** @lends Container# */ {

    templateDidLoad: {
        value: function () {
            var self = this;
            this._environement = {};

            this.blockDrawGate.setField("volume", false);

            this.application.dataService.getNewInstanceForType(Model.DockerVolume).then(function (volume) {
                self._volume = volume;
                self.blockDrawGate.setField("volume", true);
            });

            Model.populateObjectPrototypeForType(Model.DockerImage).then(function (DockerImage) {
                self._dockerImageService = DockerImage.constructor.services;
            });

        }
    },

    enterDocument: {
        value: function () {
            this._fetchDataIfNeeded();
        }  
    },

    exitDocument: {
        value: function () {
            this._reset();
        }
    },

    _fetchDataIfNeeded: {
        value: function () {
            if (!this._images) {
                var self = this;
                this._dockerImageService.getTemplates().then(function(templates) {
                    var templatesNames = Object.keys(templates);
                    self._images = templatesNames.map(function(x) {
                        return {
                            label: x,
                            value: templates[x].image
                        };
                    });
                });
            }
        } 
    },

    _reset: {
        value: function () {
            this._volume.clear();
            this._environement.clear();
        }
    },

    _regexEnvironmentVariable: {
        value: /^(\w+=\w+;)*(\w+=\w+;?)?$/
    },

    _isValidEnvironmentVariableString: {
        value: function (string) {
            return typeof string === "string" && this._regexEnvironmentVariable.test(string);
        }
    },

    _getEnvironmentVariableFromString: {
        value: function (string) {
            var env = null;

            if (string && this._isValidEnvironmentVariableString(string)) {
                var variables = string.split(";"),
                    variable, keysValues;

                env = this._environement;

                for (var i = 0, length = variables.length; i < length; i++) {
                    variable = variables[i];

                    if (variable) {
                        keysValues = variable.split("=");
                        env[keysValues[0]] = keysValues[1];
                    }
                }
            }

            return env;
        }
    },

    save: {
        value: function () {
            var environmentComponentString = this._environmentComponent.value,
                commandString = this._commandComponent.value,
                namesString = this._namesComponent.value,
                spaceString = " ",
                self = this;

            if (commandString) {
                this.object.command = commandString.split(spaceString);
            }

            if (namesString) {
                this.object.names = namesString.split(spaceString);
            }

            if (environmentComponentString) {
                this.object.environment = this._getEnvironmentVariableFromString(environmentComponentString);
            }

            if (this._volume.container_path && this._volume.host_path) {
                this.object.volumes = [this._volume];
            } else if (this.object.volumes && this.object.volumes.length) {
                this.object.volumes = null;
            }

            return this.application.dataService.saveDataObject(this.object).then(function () {
                self._reset();
            });
        }
    }

});
