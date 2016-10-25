var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

var AbstractInspector = exports.AbstractInspector = AbstractComponentActionDelegate.specialize({
    __sectionService: {
        value: null
    },

    _sectionService: {
        get: function() {
            if (!this.__sectionService) {
                this.__sectionService = this.application.sectionService;
            }
            return this.__sectionService;
        }
    },

    templateDidLoad: {
        value: function() {
            if (typeof this._inspectorTemplateDidLoad === 'function') {
                var self = this;
                this._canDrawGate.setField(this.constructor.ABSTRACT_DRAW_GATE_FIELD, false);
                var templateDidLoadPromise = this._inspectorTemplateDidLoad();
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
            if (this.context && this.context.object) {
                this.validationController.load(this);
            }
        }
    }
}, {
    ABSTRACT_DRAW_GATE_FIELD: {
        value: "templateLoaded"
    }
});
