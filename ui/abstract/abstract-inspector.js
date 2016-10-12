var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

var AbstractInspector = exports.AbstractInspector = AbstractComponentActionDelegate.specialize({
    _sectionService: {
        get: function() {
            return this.application.sectionService;
        }
    },

    templateDidLoad: {
        value: function() {
            if (typeof this._templateDidLoad === 'function') {
                var self = this;
                this._canDrawGate.setField(this.constructor.ABSTRACT_DRAW_GATE_FIELD, false);
                var templateDidLoadPromise = this._templateDidLoad();
                if (!Promise.is(templateDidLoadPromise)) {
                    templateDidLoadPromise = Promise.resolve(templateDidLoadPromise);
                }
                templateDidLoadPromise.then(function() {
                    self._canDrawGate.setField(self.constructor.ABSTRACT_DRAW_GATE_FIELD, true);
                });
            }
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
}, {
    ABSTRACT_DRAW_GATE_FIELD: {
        value: "templateLoaded"
    }
});
