var Component = require("montage/ui/component").Component,
    Immutable = require('immutable');

exports.List = Component.specialize({

    enterDocument: {
        value: function () {
            if (this.object && this.object._stream && this.object._stream.get('partial')) {
                this._stream = this.object._stream;

                if (!this._stream.get("reachEnd") && this._stream.get("endSequence") === 1) {
                    this._needsComputeViewPortHeight = true;
                }
            }
        }
    },

    fetchMinimumItems: {
        value: function (minimumItems) {
            if (this.object.length < minimumItems) {
                var self = this;

                return this.fetchData().then(function (stream) {
                    if (self._stream.get("streamId") === stream.get("streamId") && !stream.get('reachEnd')) {
                        return self.fetchMinimumItems(minimumItems);
                    }

                    return self._stream;
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
                    if (self._stream.get("streamId") === stream.get("streamId")) {
                        self._stream = stream;
                        //Workaround: Montage bug enterdocument twice...
                        self.object._stream = stream;
                    }

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
                        minimunContentLength = Math.ceil(viewPortHeight / listItemBoundaries.height);

                     this.fetchMinimumItems(minimunContentLength);
                }

                this.element.removeChild(dummyListItem);
                this._needsComputeViewPortHeight = false;
            }
        }
    }

});
