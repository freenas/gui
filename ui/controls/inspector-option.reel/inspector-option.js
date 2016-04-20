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
            if (firstTime) {
                this.parentCascadingListItem = this._findParentCascadingListItem(this);
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "handleSelectionChange");
            }
        }
    },

    exitDocument: {
        value: function () {
            //Fixme: montage issue, not able to remove a class from the element when leaving the dom
            if (this.element.classList.contains("selected")) {
                this.element.classList.remove("selected");
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
