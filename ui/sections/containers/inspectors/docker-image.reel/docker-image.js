/**
 * @module ui/docker-image.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerImage
 * @extends Component
 */
exports.DockerImage = AbstractInspector.specialize({

    templateDidLoad: {
        value: function () {
            var self = this,
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;

            this._canDrawGate.setField(blockGateKey, false);

            this._sectionService.listDockerHosts().then(function (dockersHost) {
                self._dockerHosts = dockersHost;
                self._canDrawGate.setField(blockGateKey, true);
            });
        }
    },

    exitDocument: {
        value: function () {
            this.super();
            this._selectedHost = null;
        }
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
                this.dispatchOwnPropertyChange("createdAtDate", this.createdAtDate);
            }
        },
        get: function () {
            return this._object;
        }
    },

    createdAtDate: {
        get: function () {
            return this.object ? this.object.created_at["$date"] : null;
        }
    },


    handleMultipleSelectAddAction: {
        value: function (multipleSelect) {
            if (this._selectedHost) {
                this._sectionService.pullDockerImageToDockerHost(this.object.names[0], this._selectedHost);
            }
        }
    },

    handleMultipleSelectDeleteAction: {
        value: function (multipleSelect, multipleSelectValue, dockerName) {
            var dockerHost = this._findDockerWithName(dockerName);

            if (dockerHost) {
                this._sectionService.deleteDockerImageFromDockerHost(this.object.names[0], dockerHost.id);
            }
        }
    },

    _findDockerWithName: {
        value: function (dockerName) {
            for (var i = 0, length = this._dockerHosts.length; i < length; i++) {
                if (this._dockerHosts[i].name === dockerName) {
                    return this._dockerHosts[i];
                }
            }
        }
    },

    delete: {
        value: function () {
            return this._sectionService.deleteDockerImage(this.object);
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
