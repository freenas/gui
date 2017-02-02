var Component = require("montage/ui/component").Component;

exports.List = Component.specialize({

    enterDocument: {
        value: function () {
            this._needsComputeViewPortHeight = true;

            if (this.selectedObject && this.controller.selection[0] !== this.selectedObject) {
                this.dispatchOwnPropertyChange("selectedObject", this.selectedObject);
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
                }

                this.element.removeChild(dummyListItem);
                this._needsComputeViewPortHeight = false;
            }
        }
    }

});
