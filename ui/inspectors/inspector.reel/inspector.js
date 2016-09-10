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

    templateDidLoad: {
        value: function() {
            this._validationService = this.application.validationService;
        }
    },

    enterDocument: {
        value: function() {
            if (this.object) {
                this.object.__isLocked = false;
            }
            this._mandatoryProperties = new FastSet();
            this.missingProperties = new FastSet();
            this._buildValidationComponents();
            this._linkErrorMessages();
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
                promise = this.application.dataService.deleteDataObject(this.object).catch(this._logError);
                promise.then(function(){
                    self.object.__isLocked = false;
                    self.clearObjectSelection();
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
            return this.application.dataService.deleteDataObject(this.object).catch(this._logError);
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
            return this.application.dataService.saveDataObject(this.object).catch(this._logError);
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
                if (Array.isArray(cascadingListItem.object)) {
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

    _linkErrorMessages: {
        value: function() {
            if (this.context && this.context.error) {
                var fieldErrors = this.context.error.extra;
                if (fieldErrors) {
                    var error, path, components,
                        j, componentsLength, component;
                    for (var i = 0, length = fieldErrors.length; i < length; i++) {
                        error = fieldErrors[i];
                        if (error.path.length > 1) {
                            components = this._validationComponents[error.path.slice(1).join('.')];
                            if (components) {
                                for (j = 0, componentsLength = components.length; j < componentsLength; j++) {
                                    component = components[j];
                                    component.hasError = true;
                                    component.errorMessage = error.message;
                                }
                            }
                        }
                    }
                } else {
                    this.errorMessage = this.context.error.message;
                }
            }
        }
    },

    _buildValidationComponents: {
        value: function() {
            this._validationComponents = {};
            this._action = this.object._isNew ? 
                this._validationService.ACTIONS.CREATE : 
                this._validationService.ACTIONS.UPDATE;
            var siblingIds = Object.keys(this.parentComponent.templateObjects),
                siblingComponent, path;
            for (var i = 0, length = siblingIds.length; i < length; i++) {
                siblingComponent = this.parentComponent.templateObjects[siblingIds[i]];
                path = siblingComponent.validationPath;
                if (path) {
                    if (!this._validationComponents[path]) {
                        this._validationComponents[path] = [];
                    }
                    siblingComponent.isMandatory = this._validationService.isPropertyMandatory(this.object.Type, path, this._action);
                    if (siblingComponent.isMandatory) {
                        this.addPathChangeListener("object." + path, this, "_handleMandatoryPropertyChange");
                        this._mandatoryProperties.add(path);
                        this.missingProperties.add(path);
                    } else {
                        if (this.getPathChangeDescriptor("object." + path, this)) {
                            this.removePathChangeListener("object." + path, this);
                        }
                    }
                    siblingComponent.hasError = false;
                    this._validationComponents[path].push(siblingComponent);
                }
            }
        }
    },

    _handleMandatoryPropertyChange: {
        value: function(value, path) {
            var relativePath = path.replace(/^object\./, '');
            if (this._validationService.isValid(this.object.Type, relativePath, this._action, value)) {
                this.missingProperties.delete(relativePath);
            } else {
                this.missingProperties.add(relativePath);
            }
        }
    },

    _logError: {
        value: function (message) {
            //todo: provide UI
            console.warn(JSON.stringify(message.error));
        }
    }
});
