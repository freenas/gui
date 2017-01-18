var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService,
    DatastoreService = require("core/service/datastore-service").DatastoreService,
    _ = require("lodash");

exports.AbstractInspector = AbstractComponentActionDelegate.specialize({
    _handleInspectorExit: {
        value: null
    },

    _selectedObject: {
        value: null
    },

    selectedObject: {
        get: function() {
            return this._selectedObject;
        },
        set: function(selectedObject) {
            if (this._selectedObject !== selectedObject) {
                this._selectedObject = selectedObject;
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

    _forceSectionService: {
        value: function(sectionService) {
            this.__sectionService = this.application.sectionService = sectionService;
            this.dispatchOwnPropertyChange('_sectionService', this.__sectionService);
        }
    },

    templateDidLoad: {
        value: function() {
            this.eventDispatcherService = EventDispatcherService.getInstance();
            this.datastoreService = DatastoreService.getInstance();
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

            if (this.validationController) {
                if (!this._hasContextObjectListener) {
                    this.context.validationController = this.validationController;
                    this.addPathChangeListener("context.object", this, "_reloadValidationController");
                    this._hasContextObjectListener = true;
                }
            }
            if (_.isFunction(this._handleInspectorExit) && !this.inspectorExitListener) {
                this.inspectorExitListener = this.eventDispatcherService.addEventListener('inspectorExit', this._handleInspectorExit.bind(this));
            }
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            if (this.inspectorExitListener) {
                this.eventDispatcherService.removeEventListener('inspectorExit', this.inspectorExitListener);
                this.inspectorExitListener = null;
            }
            if (this._hasContextObjectListener) {
                this.removePathChangeListener("context.object", this);
                this._hasContextObjectListener = false;
            }
        }
    },

    hasObjectChanged: {
        value: function(defaults, ignored) {
            defaults = defaults || [];
            ignored = ignored || [];
            var result = false;
            if (!this.object._isNew) {
                var reference = this.datastoreService.getState().get(this.object._objectType).get(this.object.id).toJS(),
                    object = _.pickBy(_.toPlainObject(this.object), function(value, key) {
                        return  !_.isUndefined(value) &&
                                (key[0] !== '_' || key === '_objectType');
                    });
                _.forEach(ignored, function(path) {
                    _.unset(object, path);
                    _.unset(reference, path);
                });
                _.forEach(defaults, function(defaultKeyValue) {
                    var path = defaultKeyValue[0],
                        defaultValue = defaultKeyValue[1];
                    if (_.get(object, path) === defaultValue && _.get(reference, path, null) === null) {
                        _.unset(object, path);
                        _.unset(reference, path);
                    }
                });
                // console.log(
                //     _.reduce(object, function(result, value, key) {
                //         return _.isEqual(value, reference[key]) ?
                //             result : result.concat(key);
                //     }, [])
                // );
                result = !_.isEqual(object,reference);
            }
            return result;
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
