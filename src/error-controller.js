var Montage = require("montage").Montage,
    _ = require('lodash');

exports.ErrorController = Montage.specialize({
    _errorsMap: {
        value: null
    },

    _isLoaded: {
        value: null
    },

    _handlers: {
        value: null
    },

    _form: {
        value: null
    },

    form: {
        get: function() {
            return this._form;
        },
        set: function(form) {
            if (this._form !== form) {
                this._form = form;
                this._form.errors = [];
                this._isLoaded = false;
                this.addPathChangeListener('_form._inDocument', this, 'loadForm');
            }
        }
    },

    constructor: {
        value: function() {
            this._errorsMap = new Map();
            this.errors = [];
            this._handlers = new Map();
        }
    },

    checkIsValid: {
        value: function() {
            var errors = [];
            _.forEach(this._form.templateObjects, function(component) {
                if (_.isFunction(component.handleBlur)) {
                    component.handleBlur();
                    errors.push(component.error);
                }
            });
            return _.isEmpty(_.compact(errors));
        }
    },

    loadForm: {
        value: function(inDocument) {
            if (inDocument && !this._isLoaded) {
                var self = this;
                _.forEach(this._form.templateObjects, function(component, alias) {
                    if (_.has(component, 'error')) {
                        component.addPathChangeListener('error', self.getErrorHandlerForComponent(component, alias));
                    }
                });
                this._isLoaded = true;
            }
        }
    },

    getErrorHandlerForComponent: {
        value: function(component, alias) {
            var self = this;
            var handler = function() {
                self.handleErrorChange(component);
            };
            if (this._handlers.get(alias)) {
                component.removePathChangeListener('error', this._handlers.get(alias))
            }
            this._handlers.set(alias, handler);
            return handler;
        }
    },

    handleErrorChange: {
        value: function(component) {
            var self = this;
            this._errorsMap.set(component, component.error);
            // DTM
            this.form.errors.clear();
            this._errorsMap.forEach(function(error, component) {
                if (error) {
                    self.form.errors.push({
                        component: component,
                        name: component.errorName || component.name || component.label,
                        error: error
                    });
                }
            });
            this.dispatchOwnPropertyChange('form.errors', this.form.errors);
        }
    }
});
