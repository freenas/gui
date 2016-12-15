var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    ServiceSectionService = require("core/service/section/service-section-service").ServiceSectionService;

exports.Service = AbstractInspector.specialize({
    systemGeneral: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.__sectionService = new ServiceSectionService();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (isFirstTime) {
                var self = this;
                return this._sectionService.getSystemGeneral().then(function(systemGeneral) {
                    self.systemGeneral = systemGeneral;
                });
            }
        }
    },

    save: {
        value: function() {
            if (this.configComponent && typeof this.configComponent.save === 'function') {
                this.configComponent.save();
            }
            this._sectionService.saveService(this.object);
        }
    }
});
