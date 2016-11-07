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

    _context: {
        value: null
    },

    context: {
        set: function (context) {
            if (this._context !== context) {
                if (context) {
                    context.object = context.object.modelObject;
                    this._context = context;
                } else {
                    this._context = null;
                }
            }
        },
        get: function () {
            return this._context;
        }
    },

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                if (object) {
                    this._object = object.modelObject;
                    this._collection = object.dockerCollection;
                } else {
                    this._object = this._collection = null;
                }
            }
        },
        get: function () {
            return this._object;
        }
    },

    enterDocument: {
        value: function (firstTime) {
            this.super();

            if (firstTime) {
                this.addRangeAtPathChangeListener("_dockerImages", this, "_handleDockerImagesChange");
            }

            if (!this._loadDataPromise) {
                var self = this;
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

    exitDocument: {
        value: function () {
            this.super();
            this._selectedHost = null;
            this._selectedImage = null;
            this._loadDataPromise = null;
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
