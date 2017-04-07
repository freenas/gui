var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    ServiceSectionService = require("core/service/section/service-section-service").ServiceSectionService;

exports.Service = AbstractInspector.specialize({
    systemGeneral: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this.__sectionService = new ServiceSectionService();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (isFirstTime) {
                var self = this;
                this._sectionService.getSystemGeneral().then(function(systemGeneral) {
                    self.systemGeneral = systemGeneral;
                });
            }
            this.modelChangeListener = this._eventDispatcherService.addEventListener(ModelEventName.Service.change(this.object.id), this._handleServiceChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this._eventDispatcherService.removeEventListener(ModelEventName.Service.change(this.object.id), this.modelChangeListener);
        }
    },

    save: {
        value: function() {
            if (this.configComponent && typeof this.configComponent.save === 'function') {
                this.configComponent.save();
            }

            if (this.name === 'afp' || this.name === 'smb') {
                this.object.config.guest_user = this.context.guestUser.username;
            }

            this._sectionService.saveService(this.object);
        }
    },

    _handleServiceChange: {
        value: function(state) {
            this.object.state = state.get('state');
        }
    }
});
