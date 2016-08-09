/**
 * @module ui/inspector.reel
 */
var Component = require("montage/ui/component").Component,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Inspector
 * @extends Component
 */
exports.Inspector = Component.specialize(/** @lends Inspector# */ {

    handleDeleteAction: {
        value: function (event) {
            var promise;

            this._isToBeDeleted = true;

            if (typeof this.parentComponent.delete === 'function') {
                promise = this.parentComponent.delete();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                promise = this.application.dataService.deleteDataObject(this.object).catch(this._logError);
            } else {
                console.warn('NOT IMPLEMENTED: delete() on', this.parentComponent.templateModuleId);
            }
            event.stopPropagation();
        }
    },

    handleRevertAction: {
        value: function(event) {
            var promise;
            if (typeof this.parentComponent.revert === 'function') {
                promise = this.parentComponent.revert();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                promise = this.revert();
            } else {
                console.warn('NOT IMPLEMENTED: revert() on', this.parentComponent.templateModuleId);
            }
            event.stopPropagation();
        }
    },

    handleSaveAction: {
        value: function(event) {
            var self = this,
                promise;

            if (typeof this.parentComponent.save === 'function') {
                promise = this.parentComponent.save();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                promise = this.save();
            } else {
                console.warn('NOT IMPLEMENTED: save() on', this.parentComponent.templateModuleId);
            }

            if (Promise.is(promise)) {
                if (this._isCreationInspector()) {
                    this.isLocked = true;
                }

                promise.then(function() {
                    if (self.keys && self.keys.length > 0) {
                        return self._selectObjectInViewer();
                    } else {
                        return self._resetCreateInspectorIfNeeded();
                    }
                }).finally(function () {
                    self.isLocked = false;
                });
            } else {
                return self._resetCreateInspectorIfNeeded();
            }

            event.stopPropagation();
        }
    },

    save: {
        value: function() {
            return this.application.dataService.saveDataObject(this.object).catch(this._logError);
        }
    },

    _selectObjectInViewer: {
        value: function() {
            var self = this;
            if (this._isCreationInspector()) {
                var viewer = this._findParentViewer();
                if (viewer) {
                    var currentObject = viewer.object.filter(function(x) { return self._areKeysIdentical(x); })[0];
                    if (currentObject) {
                        viewer.cascadingListItem.selectedObject = currentObject;
                    }
                }
            }
        }
    },

    _areKeysIdentical: {
        value: function(viewerObject) {
            var result = false,
                key;
            if (this.keys && this.object) {
                result = true;
                for (var i = 0, length = this.keys.length; i < length; i++) {
                    key = this.keys[i];
                    if (this.object[key] !== viewerObject[key]) {
                        result = false;
                        break;
                    }
                }
            }
            return result;
        }
    },

    _findParentViewer: {
        value: function() {
            var result,
                cascadingListItems = this.context.cascadingListItem.cascadingList._stack,
                cascadingListItem;
            for (var i = cascadingListItems.length -1; i >= 0; i--) {
                cascadingListItem = cascadingListItems[i];
                if (Array.isArray(cascadingListItem.object) && 
                        cascadingListItem.object._meta_data.collectionModelType === this.object.constructor.Type) {
                    result = cascadingListItem;
                    break;
                }
            }
            return result;
        }
    },

    revert: {
        value: function() {
            var self = this;
            return this.application.dataService.restoreSnapshotVersion(this.object).then(function(object) {
                if (self.object._isNew) {
                    self.object = object;
                }
            });
        }
    },

    _resetCreateInspectorIfNeeded: {
        value: function () {
            if (this._isCreationInspector()) {
                var cascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this),
                    context = cascadingListItem.data,
                    contextObject = context.object,
                    type = contextObject.constructor.Type;

                return this.application.dataService.getNewInstanceForType(type).then(function (newInstance) {
                    if (Model.NetworkInterface === type) { // FIXME!
                        newInstance.type = contextObject.type;
                        newInstance._isNewObject = true;
                        newInstance.aliases = [];
                        newInstance.name = "";
                    }

                    context._isNewObject = contextObject._isNewObject;
                    context._isNew = contextObject._isNew;

                    // context.object -> dispatch changes through bindings.
                    context.object = newInstance;
                });
            }

            return Promise.resolve();
        }
    },

    _isCreationInspector: {
        value: function() {
            var result = false;
            if (this._inDocument) {
                var cascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this);

                if (cascadingListItem) {
                    var context = cascadingListItem.data,
                        contextObject = context.object;

                    result = contextObject.id === null || contextObject._isNewObject || contextObject._isNew
                } else {
                    console.warn("cascadingListItemContext not existing, need investigating");
                }
            }
            return result;
        }
    },

    _logError: {
        value: function (message) {
            //todo: provide UI
            console.warn(JSON.stringify(message.error));
        }
    }
});
