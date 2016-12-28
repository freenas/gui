var Component = require("montage/ui/component").Component,
    CascadingListItem = require("ui/controls/cascading-list.reel/cascading-list-item.reel").CascadingListItem;


exports.CascadingList = Component.specialize({}, {
    findCascadingListItemContextWithComponent: {
        value: function (component) {
            var parentComponent = component.parentComponent;

            if (parentComponent) {
                if (parentComponent instanceof CascadingListItem) {
                    return parentComponent;
                }

                return this.findCascadingListItemContextWithComponent(parentComponent);
            }

            return null;
        }
    },

    findPreviousCascadingListItemContextWithComponent: {
        value: function (component) {
            var cascadingListItem = this.findCascadingListItemContextWithComponent(component),
                previousCascadingListItem = null;

            if (cascadingListItem && cascadingListItem.data.columnIndex > 0) {
                previousCascadingListItem = cascadingListItem.cascadingList.cascadingListItemAtIndex(cascadingListItem.data.columnIndex -1);
            }

            return previousCascadingListItem;
        }
    },

    findPreviousContextWithComponent: {
        value: function (component) {
            var previousCascadingListItem = this.findPreviousCascadingListItemContextWithComponent(component);

            return previousCascadingListItem ? previousCascadingListItem.data : null;
        }
    }
});
