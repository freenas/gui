var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    SelectionService = require("core/service/selection-service").SelectionService,
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService;

exports.AbstractInspector = AbstractComponentActionDelegate.specialize({
    _selectedObject: {
        value: null
    },

    selectedObject: {
        get: function() {
            return this._selectedObject;
        },
        set: function(selectedObject) {
            if (this._selectedObject !== selectedObject) {
                this._selectedObject = selectedObject
                if (this.context && this.context.cascadingListItem) {
                    this.context.cascadingListItem.selectedObject = selectedObject;
                }
            }
        }
    },

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
            this.selectionService = SelectionService.instance;
            this.eventDispatcherService = EventDispatcherService.getInstance();
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
            this.super(isFirstTime);

            if (this.validationController && !this._hasContextObjectListener) {
                this.context.validationController = this.validationController;
                this.addPathChangeListener("context.object", this, "_reloadValidationController");
                this._hasContextObjectListener = true;
            }
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            if (this._hasContextObjectListener) {
                this.removePathChangeListener("context.object", this);
                this._hasContextObjectListener = false;
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
