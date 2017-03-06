var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    _ = require('lodash');

exports.AlertFilter = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function () {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dataObjectChangeService = new DataObjectChangeService();
        }
    },

    enterDocument: {
        value: function (isFirstTime){
            this.super(isFirstTime);
            this.referenceFilters = _.cloneDeep(this.object.filters);
            this.deletedFilters = [];
            this.alertFiltersEventListener = this._eventDispatcherService.addEventListener(ModelEventName.AlertFilter.listChange, this._handleChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.AlertFilter.listChange, this.alertFiltersEventListener);
        }
    },

    save: {
        value: function() {
            this._sectionService.deleteAlertFilters(this.deletedFilters);
            this.deletedFilters = [];
            this._sectionService.saveAlertFilters(_.differenceWith(this.object.filters, this.referenceFilters, _.isEqual));
        }
    },

    tableWillUseNewEntry: {
        value: function () {
            return {
                _isNew: true,
                index: null,
                clazz: null,
                emitter: 'email',
                parameters: {
                    '%type': 'AlertEmitterEmail',
                    to: []
                }
            }
        }
    },

    tableWillDeleteEntry: {
        value: function(filter) {
            this.deletedFilters.push(filter);
        }
    },

    _handleChange: {
        value: function(state) {
            this._dataObjectChangeService.handleDataChange(this.object.filters, state);
            this.referenceFilters = _.cloneDeep(this.object.filters);
        }
    }
});
