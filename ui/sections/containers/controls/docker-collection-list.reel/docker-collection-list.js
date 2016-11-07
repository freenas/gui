/**
 * @module ui/docker-collection-list.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerCollectionList
 * @extends Component
 */
exports.DockerCollectionList = AbstractInspector.specialize(/** @lends DockerCollectionList# */ {

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;

            return this._sectionService.listDockerCollections().then(function (dockerCollections) {
                self._dockerCollections = dockerCollections;
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
