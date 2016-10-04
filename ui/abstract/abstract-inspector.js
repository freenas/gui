var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

var AbstractInspector = exports.AbstractInspector = AbstractComponentActionDelegate.specialize({
    _sectionService: {
        get: function() {
            return this.application.sectionService;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            
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
    }
});
