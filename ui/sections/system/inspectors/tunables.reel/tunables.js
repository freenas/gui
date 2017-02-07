var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService;


exports.Tunables = AbstractInspector.specialize({

    _inspectorTemplateDidLoad: {
        value: function (){
            var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dataObjectChangeService = new DataObjectChangeService();
            return this._sectionService.listTunables().then(function (tunables) {
                self.tunables = tunables;
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            this.super(isFirstTime);
            this._changeListener = this._eventDispatcherService.addEventListener(ModelEventName.Tunable.listChange, this._handleListChange.bind(this));
        }
    },

    exitDocument: {
        value: function () {
            this._eventDispatcherService.removeEventListener(ModelEventName.Tunable.listChange, this._changeListener);
        }
    },

    _handleListChange: {
        value: function (state) {
            this._dataObjectChangeService.handleDataChange(this.tunables, state);
        }
    }
});
