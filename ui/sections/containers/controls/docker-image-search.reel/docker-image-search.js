var Component = require("montage/ui/component").Component;

exports.DockerImageSearch = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener('imageComponent.selectedRow', this, '_handleRowSelection');
            }
        }
    },

    exitDocument: {
        value: function () {
            this._templates = null;
            this.selectedValue = null;
            this.collection = null;
            this.errorMessage = null;
        }
    },

    dockerImagesPromise: {
        set: function (promise) {
            if (promise && Promise.is(promise)) {
                var self = this;
                this._isSearchingDockerImages = true;

                promise.then(function (templates) {
                    var collectionPrefix = self.collection.collection + "/";

                    self._templates = templates.map(function (template) {
                        template.label = template.name.replace(collectionPrefix, "");
                        return template;
                    });
                }).catch(function (error) {
                    self.message = error.message || error;
                }).finally(function () {
                    if (!self.message && !self._templates.length) {
                        self.message = "no docker images";
                    }

                    self._isSearchingDockerImages = false;
                });
            }
        }
    },

    _handleRowSelection: {
        value: function(selectedRow) {
            this.selectedValue = selectedRow;
        }
    }

});
