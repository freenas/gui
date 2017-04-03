var Component = require("montage/ui/component").Component,
    Promise = require("montage/core/promise").Promise,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList,
    RoutingService = require("core/service/routing-service").RoutingService,
    _ = require("lodash");

exports.Inspector = Component.specialize({
    confirmDeleteMessage: {
        value: null
    },

    isSaveDisabled: {
        value: false
    },

    helpShown: {
        value: false
    },

    handleInspectorHelpButtonAction: {
        value: function () {
            this.helpShown = !this.helpShown;
        }
    },

    parentCascadingListItem: {
        get: function () {
            return this._parentCascadingListItem ||
                (this._parentCascadingListItem = CascadingList.findCascadingListItemContextWithComponent(this));
        }
    },

    templateDidLoad: {
        value: function() {
            this.super();
            this._routingService = RoutingService.getInstance();
            this._modelDescriptorService = ModelDescriptorService.getInstance();
        }
    },

    enterDocument: {
        value: function() {
            if (this.object) {
                this.object.__isLocked = false;
            }
        }
    },

    exitDocument: {
        value: function() {
            this.isDeleteConfirmationVisible = false;
            this.isSaveConfirmationVisible = false;
        }
    },

    handleDeleteAction: {
        value: function() {
            this.isDeleteConfirmationVisible = true;
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this.addEventListener("action", this);
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
                promise = this.delete().catch(this._logError);
                promise.then(function(){
                    self.object.__isLocked = false;
                });
            } else if (this.controller) {
                console.warn('NOT IMPLEMENTED: delete() on ', this.controller.templateModuleId);
            } else {
                console.warn('NOT IMPLEMENTED: delete() on unknown controller.');
            }

            promise = Promise.is(promise) ? promise : Promise.resolve(promise);
            if (event) {
                event.stopPropagation();
            }
            promise.then(function() {
                self.clearObjectSelection();
            });

            this.isDeleteConfirmationVisible = false;
            if (this.extraDeleteFlags) {
                _.forEach(this.extraDeleteFlags, function(flag) {
                    flag.checked = false;
                });
            }
        }
    },

    cancelDelete: {
        value: function() {
            this.isDeleteConfirmationVisible = false;
        }
    },

    delete: {
        value: function() {
            var self = this,
                args = _.toArray(arguments);
            this.object.__isLocked = true;
            return this._getObjectDao(this.object).then(function(dao) {
                return dao.delete(self.object, args);
            });
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
                this.revert(this.object);
            } else if (this.controller) {
                console.warn('NOT IMPLEMENTED: revert() on ', this.controller.templateModuleId);
            } else {
                console.warn('NOT IMPLEMENTED: revert() on unknown controller.');
            }
            event.stopPropagation();
        }
    },

    handleNavigationBackButtonAction: {
        value: function () {
            this._routingService.closeColumn(this.context.columnIndex);
        }
    },

    handleSaveAction: {
        value: function(event) {
            if (!!this.needSaveConfirmation) {
                this.isSaveConfirmationVisible = true;
                event.stopPropagation();
            } else {
                return this.confirmSave(event);
            }
        }
    },

    confirmSave: {
        value: function(event) {
            var self = this,
                promise;

            var isCreationInspector = this._isCreationInspector();
            if (this.controller && typeof this.controller.save === 'function') {
                promise = this.controller.save();
            } else if (this.object) {
                promise = this.save();
            } else if (this.controller) {
                console.warn('NOT IMPLEMENTED: save() on ', this.controller.templateModuleId);
            } else {
                console.warn('NOT IMPLEMENTED: save() on unknown controller.');
            }

            if (isCreationInspector) {
                this.object.__isLocked = true;
            }

            promise = Promise.is(promise) ? promise : Promise.resolve(promise);
            if (event) {
                event.stopPropagation();
            }

            this.isSaveConfirmationVisible = false;
            return promise
                .catch(this._logError)
                .then(function(task) {
                    if (isCreationInspector) {
                        self.clearObjectSelection();
                    }
                    return task;
                });
        }
    },

    cancelSave: {
        value: function() {
            this.isSaveConfirmationVisible = false;
        }
    },

    save: {
        value: function() {
            var self = this;
            return (function(object, args) {
                return self._getObjectDao(object).then(function(dao) {
                    return dao.save(object, _.values(args));
                });
            })(this.object, arguments);
        }
    },

    clearObjectSelection: {
        value: function() {
            return this._routingService.closeColumn(this.context.columnIndex);
        }
    },


    _findParentViewer: {
        value: function() {
            var result,
                cascadingListItems = this.context.cascadingListItem.cascadingList.stack,
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
            this._routingService.navigate(this.context.path, true);
            return Promise.resolve();
        }
    },

    _getObjectDao: {
        value: function(object) {
            return this._modelDescriptorService.getDaoForObject(object);
        }
    },

    _isCreationInspector: {
        value: function() {
            return this.object && !!this.object._isNew;
        }
    },

    _logError: {
        value: function (error) {
            //todo: provide UI
            console.warn(JSON.stringify(error));
        }
    }
});
