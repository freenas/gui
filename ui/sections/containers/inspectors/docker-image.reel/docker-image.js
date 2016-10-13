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
            // this._sectionService.addImageToHost().then(function () {
            // });
        }
    },

    handleMultipleSelectDeleteAction: {
        value: function (multipleSelect, multipleSelectValue, hostName) {
            // this._sectionService.removeImageFromHost().then(function () {
            // });

            // var host;

            // for (var i = 0, length = this._dockerHosts.length; i < length; i++) {
            //     if (this._dockerHosts[i].name === hostName) {
            //         host = this._dockerHosts[i];
            //         break;
            //     }
            // }

            // if (host) {
            //     this.object.hosts.splice(this.object.hosts.indexOf(host.id), 1);
            // }
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
