var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
    ModelEventName = require("core/model-event-name").ModelEventName;

var _ = require("lodash");

exports.Certificates = AbstractInspector.specialize({

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.CryptoCertificate.listChange, this.availableCertsEventListener);
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
            this._eventDispatcherService = EventDispatcherService.getInstance()
            this._dataObjectChangeService = new DataObjectChangeService();
            return this._sectionService.listCertificates().then(function (certificates) {
                self.certificates = certificates;
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            if (isFirstTime) {
                this.addPathChangeListener("viewer.selectedObject", this, "_handleSelectedEntryChange");
            }
            this.availableCertsEventListener = this._eventDispatcherService.addEventListener(ModelEventName.CryptoCertificate.listChange, this._handleChange.bind(this));
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
