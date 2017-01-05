var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName;


exports.Certificates = AbstractInspector.specialize({

    eventDispatcherService: {
        get: function() {
            if (!this._eventDispatcherService) {
                this._eventDispatcherService = EventDispatcherService.getInstance();
            }
            return this._eventDispatcherService;
        }
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            this._object = object;
            this.availableCertsEventListener = this.eventDispatcherService.addEventListener(Model.CryptoCertificate.listChange, this._handleChange.bind(this));
        }
    },

    _unregisterUpdates: {
        value: function () {
            this.eventDispatcherService.removeEventListener(Model.CryptoCertificate.listChange, this.availableCertsEventListener);
        }
    },

    exitDocument: {
        value: function() {
            this._unregisterUpdates();
        }
    },

    _handleChange: {
        value: function(state) {
            _.assign(this.object, state.toJS());
            this._unregisterUpdates();
        }
    },

    _inspectorTemplateDidLoad: {
        value: function (){
            var self = this;
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
