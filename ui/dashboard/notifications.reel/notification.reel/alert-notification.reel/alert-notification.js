/**
 * @module ui/notification.reel
 */
var Component = require("montage/ui/component").Component,
    SystemService = require("core/service/system-service").SystemService,
    moment = require('moment-timezone'),
    ModelEventName = require("core/model-event-name").ModelEventName,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService;

/**
 * @class AlertNotification
 * @extends Component
 */
exports.AlertNotification = Component.specialize(/** @lends AlertNotification# */ {
    templateDidLoad: {
        value: function() {
            this.eventDispatcherService = EventDispatcherService.getInstance();
        }
    },

    timeFormat: {
        value: "HH:mm:ss"
    },

    setDate: {
        value: function() {
            var displayedDate = this.object.updated_at;
            this.object.date = moment.utc(displayedDate.$date).tz(this.timezone).format(this.timeFormat);
        }
    },

    enterDocument: {
        value: function() {
            var self = this;
            this.systemService = SystemService.getInstance();
            this.object.startDate = this.systemService.getGeneral().then(function (general) {
                self.timezone = general.timezone;
            }).then(function() {
                self.setDate();
            });
            this.generalChangeListener = this.eventDispatcherService.addEventListener(ModelEventName.SystemGeneral.change(), this._handleSystemGeneralChange.bind(this));
        }
    },

    exitDocument: {
        value: function() {
            this.eventDispatcherService.removeEventListener(ModelEventName.SystemGeneral.change(), this.generalChangeListener);
        }
    },

    _handleSystemGeneralChange: {
        value: function(systemGeneral) {
            this.timezone = systemGeneral.get('timezone');
            this.setDate();
        }
    },

    handleDismissButtonAction: {
        value: function(event) {
            this.object._dismissing = true;
            EventDispatcherService.getInstance().dispatch('alertDismiss', this.object);
            event.stopPropagation();
        }
    }
});
