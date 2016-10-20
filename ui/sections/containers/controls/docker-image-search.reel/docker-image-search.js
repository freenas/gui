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
            this.collectionValue = null;

            if (firsTime) {
                this.addPathChangeListener("collectionValue", this, "_handleCollectionValueChange");
            }
        }
    },

    _handleCollectionValueChange: {
        value: function (value) {
            this._resetSearchQuery();

            if (value && value.length) {
                var self = this;
                this._isSearchingDockerImages = true;
                
                this._searchCollectionTimeoutId = setTimeout(function () {
                    var promise;

                    self._searchPromise = promise = self._sectionService.getDockerImagesWithCollectionName(value).then(function (templates) {
                        if (promise === self._searchPromise && self._isSearchingDockerImages) {
                            self._templates = templates;
                            self._images = templates.map(function (template) {
                                return {
                                    label: template.name,
                                    value: template.name
                                };
                            });

                            self._searchPromise = null;
                            self._isSearchingDockerImages = false;
                        }
                    });
                }, 400);
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
