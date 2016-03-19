var Button = require("montage/ui/button.reel").Button,
    CascadingListItem = require("ui/controls/cascading-list.reel/cascading-list-item.reel").CascadingListItem;

/**
 * @class InspectorOption
 * @extends Component
 */
exports.InspectorOption = Button.specialize({

    hasTemplate: {
        value: true
    },

    parentCascadingListItem: {
        value: null
    },


    enterDocument: {
        value: function (firstTime) {
            //fixme: can't use frb "classList.has('selected')": {"<-": "@owner.parentCascadingListItem.selectedObject == @owner.object"}
            //fixme: the selection is not great at all.

            if (firstTime) {
                this.parentCascadingListItem = this._findParentCascadingListItem(this);
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "handleSelectionChange");
            }
        }
    },

    handleSelectionChange: {
        value: function () {
            if (this.parentCascadingListItem.selectedObject === this.object) {
                this.classList.add("selected");
            } else {
                this.classList.remove("selected");
            }
        }
    },


    handleAction: {
        value: function () {
            this.parentCascadingListItem.selectedObject = this.object;
        }
    },


    _findParentCascadingListItem: {
        value: function (component) {
            var parentComponent = component.parentComponent;

            if (parentComponent) {
                if (parentComponent instanceof CascadingListItem) {
                    return parentComponent;
                }

                return this._findParentCascadingListItem(parentComponent);
            }

            return null;
        }
    }

});
