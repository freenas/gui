var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class Viewer
 * @extends Component
 */
exports.Viewer = AbstractComponentActionDelegate.specialize({

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;

                //fixme: workaround for a range controller with a sort path. There is a issue
                // for objects within a collection that doesn't have the property used for sorting.
                // ex: sortingKey = "name"; object1: { name: 'foo'}, object2: {username: 'bar'}
                // -> https://bugs.freenas.org/issues/15124
                if (this.sortingKey) {
                    this.sortingKey = null;
                }

                if (object) {
                    var self = this;

                    this.application.delegate.userInterfaceDescriptorForObject(object).then(function (UIDescriptor) {
                        self.hasCreateEditor = !!UIDescriptor.creatorComponentModule;

                        if (UIDescriptor.sortExpression) {
                            self.sortingKey = UIDescriptor.sortExpression;
                        } else if (UIDescriptor.nameExpression) {
                            self.sortingKey = UIDescriptor.nameExpression;
                        }

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
                    this.object._meta_data.collectionModelType : this.object.constructor.Type;

                this.selectedObject = null;

                if (type) {
                    var self = this;
                    //Fixme: getDataObject must return a promise!
                    return self.application.dataService.getNewInstanceForType(type).then(function (newInstance) {
                        self.parentCascadingListItem.selectedObject = newInstance;
                    });
                }
            }
        }
    },

    _parentCascadingListItem: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return this._parentCascadingListItem || 
                (this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this));
        }
    }

});
