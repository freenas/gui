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
                this._images = [
                    {
                        label: "nginx",
                        value: "nginx:latest"
                    },
                    {
                        label: "alpine",
                        value: "alpine:latest"
                    },
                    {
                        label: "debian",
                        value: "debian:latest"
                    },
                    {
                        label: "ubuntu",
                        value: "ubuntu:latest"
                    }
                ];
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
            var commandString = this._commandComponent.value;

            if (commandString) {
                this.object.command = commandString.slipt(" ");
            }

            if (this._volume.container_path && this._volume.host_path) {
                this.object.volumes = [this._volume];
            } else if (this.object.volumes.length) {
                this.object.volumes = null;
            }

            return this.applicationService.saveDataObject(this.object).then(function () {
                self._resetVolume();
            });
        }
    }

});
