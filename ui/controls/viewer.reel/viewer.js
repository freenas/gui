var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    CascadingListItem = require("ui/controls/cascading-list.reel/cascading-list-item.reel").CascadingListItem;

/**
 * @class Viewer
 * @extends Component
 */
exports.Viewer = Component.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    var self = this;

                    this.application.delegate.userInterfaceDescriptorForObject(object).then(function (UIDescriptor) {
                        self.hasCreateEditor = !!UIDescriptor.creatorComponentModule;

                    }).catch(function (error) {
                        console.warn(error);
                    });
                }
            }
        },
        get: function () {
            return this._object;
        }
    },

    hasCreateEditor: {
        value: false
    },

    handleCreateButtonAction: {
        value: function () {
            if (this.hasCreateEditor) {
                var type = Array.isArray(this.object) && this.object._meta_data ?
                    this.object._meta_data.collectionModelType : Object.getPrototypeOf(this.object).Type;

                this.selectedObject = null;

                if (type) {
                    var self = this;
                    //Fixme: getDataObject must return a promise!
                    return Model.populateObjectPrototypeForType(type).then(function () {
                        self.parentCascadingListItem.selectedObject = self.application.dataService.getDataObject(type);
                    });
                }
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
