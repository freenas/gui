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
            this._resetVolume();
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

    _resetVolume: {
        value: function () {
            for (var key in this._volume) {
                if (this._volume.hasOwnProperty) {
                    this._volume[key] = null;
                }
            }
        }
    },

    save: {
        value: function () {
            var commandString = this._commandComponent.value,
                namesString = this._namesComponent.value,
                self = this;

            if (commandString) {
                this.object.command = commandString.split(" ");
            }

            if (namesString) {
                this.object.names = namesString.split(" ");
            }

            if (this._volume.container_path && this._volume.host_path) {
                this.object.volumes = [this._volume];
            } else if (this.object.volumes && this.object.volumes.length) {
                this.object.volumes = null;
            }

            return this.application.dataService.saveDataObject(this.object).then(function () {
                self._resetVolume();
            });
        }
    }

});
