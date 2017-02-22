var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    EventDispatcherService = require('core/service/event-dispatcher-service').EventDispatcherService,
    ModelEventName = require('core/model-event-name').ModelEventName,
    DataObjectChangeService = require('core/service/data-object-change-service').DataObjectChangeService;

exports.Ntpservers = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function (){
            var self = this;
            this._dataObjectChangeService = new DataObjectChangeService();
            return this._sectionService.listNtpServers().then(function (ntpservers) {
                self.ntpservers = ntpservers;
                EventDispatcherService.getInstance().addEventListener(ModelEventName.NtpServer.listChange, self.handleNtpServersChange.bind(self));
            });
        }
    },

    handleNtpServersChange: {
        value: function(state) {
            this._dataObjectChangeService.handleContentChange(this.ntpservers, state);
        }
    }
});
