var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

var AbstractInspector = exports.AbstractInspector = AbstractComponentActionDelegate.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            this._callSuperMethod(AbstractComponentActionDelegate, 'enterDocument', arguments);
            if (this.validationController && !this._hasContextObjectListener) {
                this.addPathChangeListener("context.object", this, "_reloadValidationController");
                this._hasContextObjectListener = true;
            }
        }
    },

    exitDocument: {
        value: function() {
            this._callSuperMethod(AbstractComponentActionDelegate, 'exitDocument', arguments);
        }
    }

    _reloadValidationController: {
        value: function() {
            this.validationController.load(this);
        }
    }
});
