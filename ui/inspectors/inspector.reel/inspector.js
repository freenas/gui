/**
 * @module ui/inspector.reel
 */
var Component = require("montage/ui/component").Component,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Model = require("core/model/model").Model,
    Promise = require("montage/core/promise").Promise,
    FastSet = require("collections/fast-set");

/**
 * @class Inspector
 * @extends Component
 */
exports.Inspector = Component.specialize(/** @lends Inspector# */ {
    confirmDeleteMessage: {
        value: null
    },

    isSaveDisabled: {
        value: false
    },

    enterDocument: {
        value: function() {
            if (this.object) {
                this.object.__isLocked = false;
            }
        }
    },

    handleDeleteAction: {
        value: function() {
            this.isConfirmationVisible = true;
        }
    },

    confirmDelete: {
        value: function (event) {
            var self = this,
                promise;

            this._isToBeDeleted = true;

            if (this.controller && typeof this.controller.delete === 'function') {
                promise = this.controller.delete();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                this.object.__isLocked = true;
                this.clearObjectSelection();
                promise = this.application.dataService.deleteDataObject(this.object).catch(this._logError);
                promise.then(function(){
                    self.object.__isLocked = false;
                });
            } else if (this.controller) {
                console.warn('NOT IMPLEMENTED: delete() on ', this.controller.templateModuleId);
            } else {
                console.warn('NOT IMPLEMENTED: delete() on unknown controller.');
            }

            if (event) {
                event.stopPropagation();
            }

            this.isConfirmationVisible = false;
        }
    },

    cancelDelete: {
        value: function() {
            this.isConfirmationVisible = false;
        }
    },

    delete: {
        value: function () {
            this.object.__isLocked = true;
            if (arguments && arguments.length > 0) {
                var args = [this.object];
                for (var i = 0, length = arguments.length; i < length; i++) {
                    args.push(arguments[i]);
                }
                return this.application.dataService.deleteDataObject.apply(this.application.dataService, args).catch(this._logError);
            }else {
                return this.application.dataService.deleteDataObject(this.object).catch(this._logError);
            }
        }
    },

    handleRevertAction: {
        value: function(event) {
            var promise;
            if (this.controller && typeof this.controller.revert === 'function') {
                promise = this.controller.revert();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                promise = this.revert();
            } else if (this.controller) {
                console.warn('NOT IMPLEMENTED: revert() on ', this.controller.templateModuleId);
            } else {
                console.warn('NOT IMPLEMENTED: revert() on unknown controller.');
            }
            event.stopPropagation();
        }
    },

    handleSaveAction: {
        value: function(event) {
            var self = this,
                promise;

            if (this.controller && typeof this.controller.save === 'function') {
                promise = this.controller.save();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                promise = this.save();
            } else if (this.controller) {
                console.warn('NOT IMPLEMENTED: save() on ', this.controller.templateModuleId);
            } else {
                console.warn('NOT IMPLEMENTED: save() on unknown controller.');
            }

            if (this._isCreationInspector()) {
                this.object.__isLocked = true;
                this.clearObjectSelection();
            }

            event.stopPropagation();
        }
    },

    save: {
        value: function() {
            if (arguments && arguments.length > 0) {
                var args = [this.object];
                for (var i = 0, length = arguments.length; i < length; i++) {
                    args.push(arguments[i]);
                }
                return this.application.dataService.saveDataObject.apply(this.application.dataService, args).catch(this._logError);
            }else {
                return this.application.dataService.saveDataObject(this.object).catch(this._logError);
            }
        }
    },

    clearObjectSelection: {
        value: function() {
            var viewer = this._findParentViewer();
            if (viewer) {
                viewer.cascadingListItem.selectedObject = null;
            }
        }
    },

    _findParentViewer: {
        value: function() {
            var result,
                cascadingListItems = this.context.cascadingListItem.cascadingList._stack,
                cascadingListItem;
            for (var i = cascadingListItems.length -1; i >= 0; i--) {
                cascadingListItem = cascadingListItems[i];
                if (Array.isArray(cascadingListItem.object) || Array.isArray(cascadingListItem.object.entries)) {
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
                return self.object;
            });
        }
    },

    _isCreationInspector: {
        value: function() {
            return !!this.object._isNew;
        }
    },

    _logError: {
        value: function (message) {
            //todo: provide UI
            console.warn(JSON.stringify(message.error));
        }
    }
});
