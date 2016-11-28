/**
 * @module ui/docker-image-search.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class DockerImageSearch
 * @extends Component
 */
exports.DockerImageSearch = Component.specialize(/** @lends DockerImageSearch# */ {

    enterDocument: {
        value: function (firsTime) {
            this._images = null;
            this.imageComponent.clearSelection();

            if (firsTime) {
                this.addPathChangeListener("collection", this, "_handleCollectionChange");
            }
        }
    },

    _handleCollectionChange: {
        value: function (collection) {
            this._resetSearchQuery();

            if (collection) {
                var self = this,
                    promise;

                this._isSearchingDockerImages = true;

                self._searchPromise = promise = self._sectionService.getDockerImagesWithCollection(collection).then(function (templates) {
                    if (promise === self._searchPromise && self._isSearchingDockerImages) {
                        self._templates = templates;
                        self._searchPromise = null;
                        self._isSearchingDockerImages = false;
                    }
                });
            } else {
                this._isSearchingDockerImages = false;
            }
        }
    },

    _resetSearchQuery: {
        value: function () {
            if (this._searchCollectionTimeoutId) {
                clearTimeout(this._searchCollectionTimeoutId);
                this._searchCollectionTimeoutId = null;
            }

            if (this._searchPromise) {
                this._searchPromise = null;
            }

            this._templates = null;
            this._images = null;
        }
    }

});
