
var ComponentModule = require("montage/ui/component"),
    Component = ComponentModule.Component,
    rootComponent = ComponentModule.__root__;

var EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener('connectionStatusChange', function(status) {
                self.connectionStatus = status;
            });
            this._sectionsServices = new Map();
            this.addPathChangeListener("application.section", this, "_handleSectionChange");
        }
    },

    draw: {
        value: function () {
            var applicationModal = this.application.applicationModal;

            // Fixme: @benoit hacky application modal is not detached once the loader has finished its work.
            if (applicationModal !== rootComponent) {
                applicationModal.attachToParentComponent();
                applicationModal.enterDocument(true);
            }
        }
    },

    _handleSectionChange: {
        value: function() {
            var self = this,
                sectionDescriptor = this.application.section,
                servicePromise;
            if (sectionDescriptor) {
                this._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, false);
                if (this._sectionsServices.has(sectionDescriptor.id)) {
                    servicePromise = Promise.resolve(this._sectionsServices.get(sectionDescriptor.id));
                } else {
                    if (sectionDescriptor.service) {
                        servicePromise = require.async(sectionDescriptor.service).then(function(module) {
                            var exports = Object.keys(module);
                            if (exports.length === 1) {
                                var clazz = module[exports[0]],
                                    instance = clazz.instance || new clazz(),
                                    instancePromise = instance.instanciationPromise;
                                self._sectionsServices.set(sectionDescriptor.id, instance);
                                return instancePromise;
                            }
                        }).then(function(service) {
                            service.section.id = sectionDescriptor.id;
                            service.section.label = sectionDescriptor.label;
                            service.section.icon = sectionDescriptor.icon;
                            return service;
                        });
                    } else {
                        console.warn("Old fashion section:", sectionDescriptor.id)
                        this.sectionGeneration = 'old';
                        this.sectionId = sectionDescriptor.id;
                        this.application.sectionService = null;
                        this._canDrawGate.setField(this.constructor.DRAW_GATE_FIELD, true);
                    }
                }
                if (Promise.is(servicePromise)) {
                    this.sectionGeneration = 'new';
                    this.sectionId = null;
                    servicePromise.then(function(service) {
                        return self.sectionService = self.application.sectionService = service;
                    }, function(error) {
                        console.warn(error.message);
                    }).finally(function() {
                        self._canDrawGate.setField(self.constructor.DRAW_GATE_FIELD, true);
                    });
                }
            }
        }
    }

}, {
    DRAW_GATE_FIELD: {
        value: "sectionLoaded"
    }
});
