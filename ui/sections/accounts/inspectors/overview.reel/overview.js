var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

exports.Overview = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super(isFirstTime);
            this._eventDispatcherService.addEventListener('accountsOverviewChange', this._handleOverviewChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this.super();
            this._eventDispatcherService.removeEventListener('accountsOverviewChange', this._handleOverviewChange.bind(this));
        }
    },

    _handleOverviewChange: {
        value: function(overview) {
            console.log('overviewChange');
            this.object = overview;
        }
    }
});
