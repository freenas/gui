var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DashboardService = require("core/service/dashboard-service").DashboardService;

exports.Alerts = AbstractComponentActionDelegate.specialize(/** @lends Alerts# */ {
    templateDidLoad: {
        value: function() {
            var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dashboardService = DashboardService.getInstance();
            this._dashboardService.listAlerts().then(function(alerts) {
                self.alerts = alerts;
                self._eventDispatcherService.addEventListener(ModelEventName.Alert.listChange, self._handleAlertsChange.bind(self));
                self._eventDispatcherService.addEventListener('alertDismiss', self._handleAlertDismiss.bind(self));
            });
        }
    },

    handleClearAction: {
        value: function () {
            for (var i = this.displayedAlerts.length - 1; i >= 0; i--) {
                this._dashboardService.dismissAlert(this.displayedAlerts[i]);
            }
        }
    },

    _handleAlertDismiss: {
        value: function (alert) {
            if (alert && !alert.dismissed) {
                return this._dashboardService.dismissAlert(alert);
            }
        }
    },

    _handleAlertsChange: {
        value: function(alerts) {
            this.alerts = alerts.toList().toJS();
        }
    }

});
