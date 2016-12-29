var Component = require("montage/ui/component").Component,
    AlertService = require("core/service/alert-service").AlertService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    _ = require("lodash");

exports.Alert = Component.specialize( {
    templateDidLoad: {
        value: function () {
            var self = this;
            this._service = AlertService.instance;
            this._service.loadEntries().then(function (entries) {
                self.entries = entries;
            });
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener("alertFilterUpdated", this._handleAlertFilterUpdate.bind(this));
        }
    },

    _handleAlertFilterUpdate: {
        value: function() {
            var self = this;
            this._service.loadEntries().then(function (entries) {
                self.entries = _.clone(entries);
                self.entries._objectType = 'AlertFilter';
            });
        }
    }
});
