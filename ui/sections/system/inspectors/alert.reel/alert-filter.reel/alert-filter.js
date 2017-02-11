
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
    ModelEventName = require("core/model-event-name").ModelEventName;

exports.AlertFilter = AbstractInspector.specialize(/** @lends AlertFilter# */ {
    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance()
            this._dataObjectChangeService = new DataObjectChangeService();
            return this._sectionService.listAlertFilters().then(function (alertFilters) {
                self.alertFilters = alertFilters;
            })
        }
    },

    _handleChange: {
        value: function(state) {
            this._dataObjectChangeService.handleDataChange(this.alertFilters, state);
        }
    },

    save: {
        value: function (){
            this._sectionService.saveAlertFilters(this.alertFilters);
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.AlertFilter.listChange, this.availableCertsEventListener);
        }
    },

    enterDocument: {
        value: function (isFirstTime){
            this.super(isFirstTime);
            this.availableCertsEventListener = this._eventDispatcherService.addEventListener(ModelEventName.CryptoCertificate.listChange, this._handleChange.bind(this));
        }
    }
});
