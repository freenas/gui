var Component = require("montage/ui/component").Component,
    Immutable = require('immutable');

exports.List = Component.specialize({

    enterDocument: {
        value: function () {
            if (this.object && this.object._stream && this.object._stream.get('partial')) {
                this._stream = this.object._stream;
                this._needsComputeViewPortHeight = true;
            }

            if (this.selectedObject && this.controller.selection[0] !== this.selectedObject) {
                this.dispatchOwnPropertyChange("selectedObject", this.selectedObject);
            }
        }
    },

    fetchMinimumItems: {
        value: function (minimumItems) {
            if (this.object.length < minimumItems) {
                var self = this;

                return this.fetchData().then(function (stream) {
                    if (!stream.get('reachEnd') && self.object.length < minimumItems) {
                        return self.fetchMinimumItems(minimumItems);
                    }
                });
            }

            return Promise.resolve(this._stream);
        }
    },

    fetchData: {
        value: function () {
            var self = this,
                promise;

            if (!this._stream.get('reachEnd')) {
                this.isLoadingData = true;

                //FIXME???
                promise = this.application.sectionService.getNextSequenceForStream(
                    this._stream.get('streamId')
                ).then(function (stream) {
                    self._stream = stream;

                    return stream;
                });
            } else {
                promise = Promise.resolve(this._stream);
            }

            return promise.finally(function () {
                self.isLoadingData = false;
            });
        }
    },

    scrollViewReachBottomY: {
        value: function () {
            if (!this.isLoadingData) {
                this.fetchData();
            }
        }
    },

    didDraw: {
        value: function () {
            if (this._needsComputeViewPortHeight) {
                var dummyListItem = document.createElement("div");
                dummyListItem.classList.add("ListItem");
                dummyListItem.style.visibility = "hidden";

                this.element.appendChild(dummyListItem);

                var listItemBoundaries = dummyListItem.getBoundingClientRect();

                if (listItemBoundaries.height) {
                    var documentBoundaries = document.documentElement.getBoundingClientRect(),
                        listItemBoundaries = dummyListItem.getBoundingClientRect(),
                        listBoundaries = this.element.getBoundingClientRect(),
                        viewPortHeight = documentBoundaries.height - listBoundaries.top,
                        minimunContentLength = Math.ceil(viewPortHeight / listItemBoundaries.height) + 5;

                     this.fetchMinimumItems(minimunContentLength);
                }

                this.element.removeChild(dummyListItem);
                this._needsComputeViewPortHeight = false;
            }
        }
    }

});
