var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    Notification = require("ui/dashboard/notifications.reel/notification.reel").Notification,
    RoutingService = require("core/service/routing-service").RoutingService;

exports.Notifications = AbstractComponentActionDelegate.specialize({
    templateDidLoad: {
        value: function() {
            this._routingService = RoutingService.getInstance();
        }
    },

    handleRetryButtonAction: {
        value: function (event) {
            var iteration = this.items._findIterationContainingElement(event.target.element);

            if (iteration) {
                this._routingService.navigate('/_/retry/' + iteration.object.id);
            }
        }
    },

    handleExpandButtonAction: {
        value: function (event) {
            var iteration = this.items._findIterationContainingElement(event.target.element);

            if (iteration) {
                var childComponents = iteration._childComponents,
                    i = 0, length = childComponents.length,
                    notificationComponent;

                while (!notificationComponent && i < length) {
                    if (childComponents[i] instanceof Notification) {
                        notificationComponent = childComponents[i++];
                    }
                }

                if (notificationComponent) {
                    notificationComponent.infoExpanded = !notificationComponent.infoExpanded;
                }
            }
        }
    }

});
