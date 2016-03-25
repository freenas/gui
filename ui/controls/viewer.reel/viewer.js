var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    CascadingListItem = require("ui/controls/cascading-list.reel/cascading-list-item.reel").CascadingListItem;

/**
 * @class Viewer
 * @extends Component
 */
exports.Viewer = Component.specialize({

    handleCreateButtonAction: {
        value: function () {
            var type = Array.isArray(this.object) ? this.object._meta_data.collectionModelType :
                Object.getPrototypeOf(this.object).Type;

            this.selectedObject = null;
            if (type) {
                var self = this;
                //Fixme: getDataObject must return a promise!
                return Model.populateObjectPrototypeForType(type).then(function () {
                    self.parentCascadingListItem.selectedObject = self.application.dataService.getDataObject(type);
                });
            }
        }
    },

    //Fixme: need selection controller.
    _parentCascadingListItem: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return this._parentCascadingListItem || (this._parentCascadingListItem = this._findParentCascadingListItem(this));
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
