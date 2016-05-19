/**
 * @module ui/inspector.reel
 */
var Component = require("montage/ui/component").Component,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    Promise = require("montage/core/promise").Promise;

/**
 * @class Inspector
 * @extends Component
 */
exports.Inspector = Component.specialize(/** @lends Inspector# */ {

    handleDeleteAction: {
        value: function (event) {
            this._isToBeDeleted = true;

            if (typeof this.parentComponent.delete === 'function') {
                var promise = this.parentComponent.delete();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                this.application.dataService.deleteDataObject(this.object).catch(this._logError);
            } else {
                console.warn('NOT IMPLEMENTED: delete() on', this.parentComponent.templateModuleId);
            }

            event.stopPropagation();
        }
    },

    handleRevertAction: {
        value: function(event) {
            if (typeof this.parentComponent.revert === 'function') {
                this.parentComponent.revert();
            } else {
                console.warn('NOT IMPLEMENTED: revert() on', this.parentComponent.templateModuleId);
            }
            event.stopPropagation();
        }
    },

    handleSaveAction: {
        value: function(event) {
            var promise;

            if (typeof this.parentComponent.save === 'function') {
                promise = this.parentComponent.save();

                if (Promise.is(promise)) {
                    promise.catch(this._logError);
                }
            } else if (this.object) {
                promise = this.application.dataService.saveDataObject(this.object).catch(this._logError);
            } else {
                console.warn('NOT IMPLEMENTED: save() on', this.parentComponent.templateModuleId);
            }

            if (Promise.is(promise)) {
                var self = this;

                promise.then(function () {
                    return self._resetCreateInspectorIfNeeded();
                });
            } else {
                this._resetCreateInspectorIfNeeded();
            }

            event.stopPropagation();
        }
    },

    _resetCreateInspectorIfNeeded: {
        value: function () {
            if (this._inDocument) {
                var cascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this);

                if (cascadingListItem) {
                    var context = cascadingListItem.data,
                        contextObject = context.object;

                    if (!contextObject.id || contextObject._isNewObject) {
                        return this.application.dataService.getNewInstanceForType(Object.getPrototypeOf(context.object).Type).then(function (newInstance) {
                            context.object = newInstance;
                        });
                    }
                } else {
                    console.warn("cascadingListItemContext not existing, need investigating");
                }
            }

            return Promise.resolve();
        }
    },

    _logError: {
        value: function (message) {
            //todo: provide UI
            console.warn(JSON.stringify(message.error));
        }
    }
});
