var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    AlertService = require("core/service/alert-service").AlertService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
_ = require("lodash");

exports.Alert = AbstractInspector.specialize( {
    _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;
            this._service = AlertService.instance;
            this._dataObjectChangeService = new DataObjectChangeService();
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener(ModelEventName.AlertFilter.listChange, this._handleAlertFilterUpdate.bind(this));
            return this._service.loadEntries().then(function (entries) {
                self.entries = entries;
            });
        }
    },

    _handleAlertFilterUpdate: {
        value: function(state) {
            this._dataObjectChangeService.handleDataChange(this.entries, state);
        }
    }
});
