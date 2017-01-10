var Montage = require("montage/core/core").Montage,
    ValidationService = require("core/service/validation-service").ValidationService,
    ModelDescriptorService = require("core/service/model-descriptor-service").ModelDescriptorService,
    _ = require("lodash");

exports.ValidationController = Montage.specialize({
    constructor: {
        value: function() {
            this._validationService = ValidationService.instance;
            this._modelDescriptorService = ModelDescriptorService.getInstance();
            this._propertyToFieldsMapping = new Map();
            this._mandatoryProperties = new Set();
            this.missingProperties = new Set();
            this.hasMissingProperties = false;
        }
    },

    load: {
        value: function(form, object) {
            var self = this;
            this._form = form;
            this._context = this._form.context;
            this._object = object || this._context.object;
            this._action = this._object._isNew ?
                ValidationService.ACTIONS.CREATE :
                ValidationService.ACTIONS.UPDATE;
            this._type = this._object._objectType;
            this.errorMessage = null;
            this._loadFromObjectDescriptor().then(function() {
                return self._loadFromFields();
            }).then(function() {
                return self._linkErrorMessages();
            });
        }
    },

    _loadFromObjectDescriptor: {
        value: function() {
            var self = this;
            return this._modelDescriptorService.getPropertyDescriptorsForType(this._type).then(function(propertyBlueprints) {
                var component;
                if (propertyBlueprints) {
                    return _.mapKeys(propertyBlueprints, function(value, path) {
                        component = self._form.templateObjects[path];
                        if (component) {
                            return self._validateComponentWithPath(component, path);
                        }
                    });
                } else {
                    return null;
                }
            });
        }
    },

    _loadFromFields: {
        value: function() {
            if (this.fields && typeof this.fields === "object") {
                var paths = Object.keys(this.fields),
                    path,
                    components, j, componentsLength;
                for (var i = 0, length = paths.length; i < length; i++) {
                    path = paths[i];
                    components = this.fields[path];
                    if (Array.isArray(components)) {
                        for (j = 0, componentsLength = components.length; j < componentsLength; j++) {
                            this._validateComponentWithPath(components[j], path);
                        }
                    } else {
                        this._validateComponentWithPath(components, path);
                    }
                }
            }
        }
    },

    _validateComponentWithPath: {
        value: function(component, path) {
            var self = this;
            if (!this._propertyToFieldsMapping.has(path)) {
                this._propertyToFieldsMapping.set(path, new Set());
            }
            this._cleanupComponentError(component);
            this._propertyToFieldsMapping.get(path).add(component);
            return this._validationService.isPropertyMandatory(this._type, path, this._action).then(function(isMandatory) {
                component.isMandatory = isMandatory;
                if (component.isMandatory) {
                    self.addPathChangeListener("_object." + path, self, "_handleMandatoryPropertyChange");
                    self._mandatoryProperties.add(path);
                    if (!self._validationService.isValid(self._type, path, self._action, self._object[path])) {
                        self.missingProperties.add(path);
                        this.hasMissingProperties = true;
                    }
                } else {
                    if (self.getPathChangeDescriptor("_object." + path, self)) {
                        self.removePathChangeListener("_object." + path, self);
                    }
                }
                component.hasError = false;
            });
        }
    },

    _handleMandatoryPropertyChange: {
        value: function(value, path) {
            var relativePath = path.replace(/^_object\./, '');
            if (this._validationService.isValid(this._type, relativePath, this._action, value)) {
                this.missingProperties.delete(relativePath);
            } else {
                this.missingProperties.add(relativePath);
            }
            this.hasMissingProperties = this.missingProperties.size > 0;
        }
    },

    _linkErrorMessages: {
        value: function() {
            if (this._context.error) {
                var fieldErrors = this._context.error.extra;
                if (fieldErrors) {
                    var error, components,
                        j, componentsLength;
                    for (var i = 0, length = fieldErrors.length; i < length; i++) {
                        error = fieldErrors[i];
                        if (error.path.length > 1) {
                            components = this._propertyToFieldsMapping.get(error.path.slice(1).join('.'));
                            if (components) {
                                if (Array.isArray(components)) {
                                    for (j = 0, componentsLength = components.length; j < componentsLength; j++) {
                                        this._addErrorMessageToComponent(error.message, components[j]);
                                    }
                                } else {
                                    this._addErrorMessageToComponent(error.message, components);
                                }
                            }
                        }
                    }
                } else {
                    this.errorMessage = this._context.error.message;
                }
            }
        }
    },

    _addErrorMessageToComponent: {
        value: function(errorMessage, component) {
            component.hasError = true;
            component.errorMessage = errorMessage;
        }
    },

    _cleanupComponentError: {
        value: function(component) {
            component.hasError = false;
            component.errorMessage = null;
        }
    }
});
