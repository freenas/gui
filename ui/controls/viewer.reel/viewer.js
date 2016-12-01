var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    _ = require("lodash"),
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class Viewer
 * @extends Component
 */
exports.Viewer = AbstractComponentActionDelegate.specialize({

    initWithDao: {
        value: function (dao) {
            this._dao = dao;
        }
    },

    displayTitle: {
        value: false
    },

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
                if (this.sortingPath) {
                    this.sortingPath = null;
                }

                if (object) {
                    var self = this,
                        promise;

                    if (Array.isArray(object) && !object.length && this._dao) {
                        promise = this._dao.list().then(function (data) {
                            if (data !== object) {
                                self._object = data;
                                self.dispatchOwnPropertyChange("object", data);
                            }

                            return data;
                        });
                    }

                    if (Promise.is(promise)) {
                        promise.then(function (object) {
                            return self._setViewerMetaDataWithObject(object);
                        });
                    } else {
                        promise = this._setViewerMetaDataWithObject(object);
                    }

                    promise.then(function() {
                        var isSortable = true;
                        for (var i = 0; i < self._object.length; i++) {
                            if (!_.has(self._object[i], self.sortingKey)) {
                                isSortable = false;
                                break;
                            }
                        }
                        if (isSortable) {
                            self.sortingPath = self.sortingKey;
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
            var self = this;
            if (this.hasCreateEditor) {
                return this.application.modelDescriptorService.getDaoForObject(this.object).then(function(dao) {
                    return dao.getNewInstance().then(function (newInstance) {
                        self.parentCascadingListItem.selectedObject = newInstance;
                    });
                }, function() {
                    // DTM
                    var type = Array.isArray(self.object) && self.object._meta_data ?
                        self.object._meta_data.collectionModelType : self.object.constructor.Type;

                    self.selectedObject = null;

                    if (type) {
                        return self.application.dataService.getNewInstanceForType(type).then(function (newInstance) {
                            self.parentCascadingListItem.selectedObject = newInstance;
                        });
                    }
                });
            }
        }
    },

    _setViewerMetaDataWithObject: {
        value: function (object) {
            var self = this;
            return this.application.modelDescriptorService.getUiDescriptorForObject(object).then(function (uiDescriptor) {
                self.userInterfaceDescriptor = uiDescriptor;
                if (uiDescriptor) {
                    self.hasCreateEditor = !!uiDescriptor.creatorComponentModule;

                    if (!self.sortingPath) {
                        if (uiDescriptor.sortExpression) {
                            self.sortingPath = uiDescriptor.sortExpression;
                        } else if (uiDescriptor.nameExpression) {
                            self.sortingPath = uiDescriptor.nameExpression;
                        }
                    }

                    self.createLabel = uiDescriptor.createLabel ? uiDescriptor.createLabel : null;
                } else {
                    self.hasCreateEditor = false;
                }
            });
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
