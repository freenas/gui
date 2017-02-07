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
    }
});
