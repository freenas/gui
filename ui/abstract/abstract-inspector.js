var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

var AbstractInspector = exports.AbstractInspector = AbstractComponentActionDelegate.specialize({
    _abstractInspectorenterDocument: {
        value: function() {
            if (this.validationController && !this._hasContextObjectListener) {
                this.addPathChangeListener("context.object", this, "_reloadValidationController");
                this._hasContextObjectListener = true;
            }
        }
    },

    _reloadValidationController: {
        value: function() {
            this.validationController.load(this);
        }
    },

    _callSuperMethod: {
        value: function(methodName, args) {
            var method = AbstractComponentActionDelegate.prototype[methodName];
            if (typeof method === "function") {
                method.apply(this, args);
            }
        }
    },

    superTemplateDidLoad: {
        value: function() {
            this._callSuperMethod('templateDidLoad', this);
        }
    },

    superEnterDocument: {
        value: function() {
            this._callSuperMethod('enterDocument', arguments);
            AbstractInspector.prototype._abstractInspectorenterDocument.call(this);
        }
    },

    superExitDocument: {
        value: function() {
            this._callSuperMethod('exitDocument');
        }
    }
});
