var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
    ModelEventName = require("core/model-event-name").ModelEventName;

var _ = require("lodash");

exports.Certificates = AbstractInspector.specialize({

    eventDispatcherService: {
        get: function() {
            if (!this._eventDispatcherService) {
                this._eventDispatcherService = EventDispatcherService.getInstance();
            }
            return this._eventDispatcherService;
        }
    },

    exitDocument: {
        value: function() {
            this.eventDispatcherService.removeEventListener(ModelEventName.CryptoCertificate.listChange, this.availableCertsEventListener);
        }
    },

    _handleChange: {
        value: function(state) {
            this._dataObjectChangeService.handleDataChange(this.certificates, state);
        }
    },

    _inspectorTemplateDidLoad: {
        value: function (){
            var self = this;
            this._dataObjectChangeService = new DataObjectChangeService();
            return this._sectionService.listCertificates().then(function (certificates) {
                self.certificates = certificates;
            });
        }
    },

    enterDocument: {
        value: function(isFirsttime) {
            this.super();
            if (isFirsttime) {
                this.addPathChangeListener("viewer.selectedObject", this, "_handleSelectedEntryChange");
            }
            this.availableCertsEventListener = this.eventDispatcherService.addEventListener(ModelEventName.CryptoCertificate.listChange, this._handleChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this.viewer.selectedObject = null;
        }
    },

    _handleSelectedEntryChange: {
        value: function(value) {
            this.selectedObject = value;
        }
    }
});
