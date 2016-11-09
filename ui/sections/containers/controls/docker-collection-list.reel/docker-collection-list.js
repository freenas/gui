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

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
                this.selectedCollection = null;
            }
        },
        get: function () {
            return this._object;
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

                this._sectionService.getNewInstanceRelatedToObjectModel(this.object).then(function (objectUIDescriptor) {
                    objectUIDescriptor.dockerCollection = self.selectedCollection;
                    objectUIDescriptor.modelObject = self.object;
                    self.selectedObject = objectUIDescriptor;
                });
            } else {
                this.selectedObject = null;
            }
        }
    }

}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
