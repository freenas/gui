var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DashboardService = require("core/service/dashboard-service").DashboardService,
    _ = require('lodash');

exports.Alerts = AbstractComponentActionDelegate.specialize(/** @lends Alerts# */ {
    handleUserLogged: {
        value: function() {
            var self = this;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dashboardService = DashboardService.getInstance();
            this.isLoading = true;
            this._dashboardService.listAlerts().then(function(alerts) {
                self.alerts = alerts.valueSeq().toJS();
                self.isLoading = false;
                self._eventDispatcherService.addEventListener(ModelEventName.Alert.listChange, self._handleAlertsChange.bind(self));
                self._eventDispatcherService.addEventListener('alertDismiss', self._handleAlertDismiss.bind(self));
            });
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.application.addEventListener("userLogged", this, false);
            }
        }
    },

    handleClearAction: {
        value: function () {
            var self = this;
            this._dashboardService.dismissAllAlerts().then(function() {
                _.forEach(self.alerts, function(alert) {
                    alert.dismissed = true;
                });
            });
        }
    },

    _handleAlertDismiss: {
        value: function (alert) {
            if (alert && !alert.dismissed) {
                return this._dashboardService.dismissAlert(alert).then(function() {
                    alert.dismissed = true;
                });
            }
        }
    },

    _handleAlertsChange: {
        value: function(alerts) {
            this.alerts = alerts.toList().toJS();
        }
    }

});
