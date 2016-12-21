var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    _ = require("lodash");

var DockerCollectionList = exports.DockerCollectionList = AbstractInspector.specialize({

    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            return this._sectionService.listDockerCollections().then(function (dockerCollections) {
                self.instances = self._dockerCollections = dockerCollections;
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super(isFirstTime);
            var self = this;
            this._canDrawGate.setField(DockerCollectionList.DATA_GATE_BLOCK_KEY, false);
            Promise.all(
                _.map(this._dockerCollections, function(collection) {
                    return self._sectionService.getNewInstanceFromObjectType(self.context.objectType).then(function(instance) {
                        instance.dockerCollection = collection;
                        instance._isNewObject = true;
                        return instance;
                    });
                })
            ).then(function(instances) {
                self.instances = instances;
                self._canDrawGate.setField(DockerCollectionList.DATA_GATE_BLOCK_KEY, true);
            })
        }
    }
}, {

    DATA_GATE_BLOCK_KEY: {
        value: "dataLoaded"
    }

});
