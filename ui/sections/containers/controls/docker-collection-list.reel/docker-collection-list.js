/**
 * @module ui/docker-collection-list.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerCollectionList
 * @extends Component
 */
exports.DockerCollectionList = AbstractInspector.specialize(/** @lends DockerCollectionList# */ {

    templateDidLoad: {
        value: function () {
            var self = this,
                blockGateKey = this.constructor.DATA_GATE_BLOCK_KEY;

            this._canDrawGate.setField(blockGateKey, false);

            return Promise.all([
                this._sectionService.getNewDockerCollection(),
                this._sectionService.listDockerCollection(),
                this._sectionService.getNewDockerContainerCreator()
            ]).then(function (data) {
                var dockerCollection = data[0],
                    dockerCollections = data[1];

                //Default Collection?
                dockerCollection.id = -1;
                dockerCollection._isNew = false;
                dockerCollection.collection = dockerCollection.name = "freenas";
                dockerCollections.unshift(dockerCollection);

                self._dockerCollections = dockerCollections;
            }).finally(function () {
                self._canDrawGate.setField(blockGateKey, true);
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super();

            if (isFirstTime) {
                this.addPathChangeListener("selectedCollection", this, "handleSelectedCollectionChange");
            }
        }
    },

    handleSelectedCollectionChange: {
        value: function () {
            if (this.selectedCollection) {
                var self = this;

                this._sectionService.getNewDockerContainerCreator().then(function (dockerContainerCreator) {
                    dockerContainerCreator.dockerCollection = self.selectedCollection;
                    dockerContainerCreator.dockerContainer = self.object;
                    self.selectedObject = dockerContainerCreator;
                });
            }
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
