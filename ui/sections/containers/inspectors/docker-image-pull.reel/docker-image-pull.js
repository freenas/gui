/**
 * @module ui/docker-image-pull.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerImagePull
 * @extends AbstractInspector
 */
exports.DockerImagePull = AbstractInspector.specialize(/** @lends DockerImagePull# */ {
    
    templateDidLoad: {
        value: function () {
            var self = this,
                promises = [],
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;

            this._environment = {};
            this._canDrawGate.setField(blockGateKey, false);

            promises.push(this._sectionService.listDockerHosts())
            promises.push(this._sectionService.listDockerImages())

            return Promise.all(promises).then(function (data) {                
                self._dockerHosts = data[0];
                self._dockerImages = data[1];
            }).finally(function () {
                self._canDrawGate.setField(blockGateKey, true);
            });
        }
    },

    enterDocument: {
        value: function (firstTime) {
            this.super();
            
            if (firstTime) {
                this.addRangeAtPathChangeListener("_dockerImages", this, "_handleDockerImagesChange");
            }
        }
    },

    exitDocument: {
        value: function () {
            this.super();
            this._selectedHost = null;
            this._selectedImage = null;
        }
    },

    save: {
        value: function () {
            if (!!this._selectedImage && !!this._selectedHost) {
                this._sectionService.pullDockerImageToDockerHost(this._selectedImage, this._selectedHost);
            }
        }
    },

    _handleDockerImagesChange: {
        value: function () {
            if (this._dockerImages) {
                this._installedDockerImages = this._dockerImages.map(function (image) {
                    var name = image.names[0];

                    return {
                        name: name.substring(0, name.indexOf(":")), 
                        hosts: image.hosts
                    };
                });
            } else {
                this._installedDockerImages = null;
            }
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }
});
