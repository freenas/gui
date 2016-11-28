var Button = require("montage/ui/button.reel").Button,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class InspectorOption
 * @extends Component
 */
exports.InspectorOption = Button.specialize({

    hasTemplate: {
        value: true
    },

    _parentCascadingListItem: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return this._parentCascadingListItem ||
                (this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this));
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "handleSelectionChange");
            }
        }
    },

    exitDocument: {
        value: function () {
            //Fixme: montage issue, not able to remove a class from the element when leaving the dom
            if (this.element.classList.contains("selected")) {
                this.classList.remove("selected");
                this.element.classList.remove("selected");
            }
        }
    },

    handleSelectionChange: {
        value: function () {
            if (this.object && this.parentCascadingListItem.selectedObject === this.object) {
                this.classList.add("selected");
                this.element.classList.add("selected");
            } else {
                this.classList.remove("selected");
                this.element.classList.remove("selected");
            }
        }
    },

    /**
     * @override handlePress
     * Don't dispath action event for perfomance purpose.
     */
    handlePress: {
        value: function () {
            this.active = false;
            this.parentCascadingListItem.selectedObject = this.object;
            this._removeEventListeners();
        }
    }

});
