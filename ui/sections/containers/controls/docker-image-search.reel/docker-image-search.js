/**
 * @module ui/docker-image-search.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class DockerImageSearch
 * @extends Component
 */
exports.DockerImageSearch = Component.specialize(/** @lends DockerImageSearch# */ {

    exitDocument: {
        value: function () {
            this._templates = null;
            this.selectedValue = null;
            this.collection = null;
        }
    },

    dockerImagesPromise: {
        set (promise) {
            if (promise && Promise.is(promise)) {
                var self = this;
                this._isSearchingDockerImages = true;

                promise.then(function (templates) {
                    var collectionPrefix = self.collection.collection + "/";

                    self._templates = templates.map(function (template) {
                        template.label = template.name.replace(collectionPrefix, "");
                        return template;
                    });

                    self._isSearchingDockerImages = false;
                });
            }
        }
    }

});
