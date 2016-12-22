/**
 * @module core/controller/validation-controller
 */
var Montage = require("montage/core/core").Montage,
    ValidationService = require("core/service/validation-service").ValidationService,
    FastSet = require("collections/fast-set"),
    FastMap = require("collections/fast-map");
/**
 * @class ValidationController
 * @extends Montage
 */
exports.ValidationController = Montage.specialize(/** @lends ValidationController# */ {
    constructor: {
        value: function() {
            this._validationService = ValidationService.instance;
            this._propertyToFieldsMapping = new FastMap();
            this._mandatoryProperties = new FastSet();
            this.missingProperties = new FastSet();
        }
    },

    load: {
        value: function(form, object) {
            this._form = form;
            this._context = this._form.context;
            this._object = object || this._context.object;
            this._action = this._object._isNew ?
                ValidationService.ACTIONS.CREATE :
                ValidationService.ACTIONS.UPDATE;
            this._type = this._object._objectType
                || (this._object.Type && this._object.Type.typeName)
                || (this._object.constructor.Type && this._object.constructor.Type.typeName);
            this._loadFromObjectDescriptor();
            this._loadFromFields();
            this._linkErrorMessages();
        }
    },

    _loadFromObjectDescriptor: {
        value: function() {
            var propertyBlueprints = this._object.constructor.propertyBlueprints,
                component, path;
            if (propertyBlueprints) {
                for (var i = 0, length = propertyBlueprints.length; i < length; i++) {
                    path = propertyBlueprints[i].name;
                    component = this._form.templateObjects[propertyBlueprints[i].name];
                    if (component) {
                        this._validateComponentWithPath(component, path);
                    }
                }
            }
        }
    },

    _loadFromFields: {
        value: function() {
            if (this.fields && typeof this.fields === "object") {
                var paths = Object.keys(this.fields),
                    path,
                    components, component, j, componentsLength;
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
            if (!this._propertyToFieldsMapping.has(path)) {
                this._propertyToFieldsMapping.set(path, new FastSet());
            }
            this._propertyToFieldsMapping.get(path).add(component);
            component.isMandatory = this._validationService.isPropertyMandatory(this._type, path, this._action);
            if (component.isMandatory) {
                this.addPathChangeListener("_object." + path, this, "_handleMandatoryPropertyChange");
                this._mandatoryProperties.add(path);
                if (!this._validationService.isValid(this._type, path, this._action, this._object[path])) {
                    this.missingProperties.add(path);
                }
            } else {
                if (this.getPathChangeDescriptor("_object." + path, this)) {
                    this.removePathChangeListener("_object." + path, this);
                }
            }
            component.hasError = false;
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
        }
    },

    _linkErrorMessages: {
        value: function() {
            if (this._context.error) {
                var fieldErrors = this._context.error.extra;
                if (fieldErrors) {
                    var error, path, components,
                        j, componentsLength, component;
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
    }
});
