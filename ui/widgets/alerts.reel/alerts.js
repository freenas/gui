/**
 * @module ui/alerts.reel
 */
var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class Alerts
 * @extends Component
 */
exports.Alerts = AbstractComponentActionDelegate.specialize(/** @lends Alerts# */ {

    handleClearAction: {
        value: function () {
            var alerts = this.notifications.items.content,
                length = alerts.length, i;

            if (length) {
                return this.application.alertServicePromise.then(function (alertService) {
                    var promises = [];

                    for (i = 0; i < length; i++) {
                        promises.push(alertService.services.dismiss(alerts[i].jobId));
                    }

                    return Promise.all(promises);
                });
            }
        }
    }

});
