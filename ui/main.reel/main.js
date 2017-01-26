var ComponentModule = require("montage/ui/component"),
    Component = ComponentModule.Component,
    rootComponent = ComponentModule.__root__,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    RoutingService = require("core/service/routing-service").RoutingService,
    SectionRepository = require("core/repository/section-repository").SectionRepository;

exports.Main = Component.specialize({
    _section: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            this.sectionRepository = SectionRepository.getInstance();
            this.routingService = RoutingService.getInstance();
            this.middlewareClient = MiddlewareClient.getInstance();
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener('connectionStatusChange', function(status) {
                self.connectionStatus = status;
            });

            this._eventDispatcherService.addEventListener('sectionChange', this._handleSectionChange.bind(this));
            this._eventDispatcherService.addEventListener('oldSectionChange', this._handleOldSectionChange.bind(this));
            this._eventDispatcherService.addEventListener('pathChange', this._handlePathChange.bind(this));
            this._eventDispatcherService.addEventListener('sectionRestored', this._handleSectionRestored.bind(this));
            this.addPathChangeListener("application.section", this, "_handleApplicationSectionChange");
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

    _handleOldSectionChange: {
        value: function(sectionId) {
            this.sectionService = this.application.sectionService = null;
            this.sectionId = sectionId;
            this.sectionGeneration = 'old';
            this.stack = null;
        }
    },

    _handleSectionChange: {
        value: function(sectionService) {
            this.sectionService = this.application.sectionService = sectionService;
            this.sectionId = null;
            this.sectionGeneration = 'new';
        }
    },

    _handlePathChange: {
        value: function(stack) {
            this.stack = stack;
        }
    },

    _handleSectionRestored: {
        value: function(sectionId) {
            this.application.section = this._section = this.application.sectionsDescriptors[sectionId];
        }
    },

    _handleApplicationSectionChange: {
        value: function() {
            if (this.application.section && this.application.section !== this._section) {
                this._section = this.application.section;
                this.routingService.navigate('/' + this.application.section.id);
            }
        }
    }

}, {
    DRAW_GATE_FIELD: {
        value: "sectionLoaded"
    }
});
