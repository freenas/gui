var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    Notification = require("ui/dashboard/notifications.reel/notification.reel").Notification,
    RoutingService = require("core/service/routing-service").RoutingService,
    TaskService = require("core/service/task-service").TaskService;

exports.Notifications = AbstractComponentActionDelegate.specialize({
    templateDidLoad: {
        value: function() {
            this._routingService = RoutingService.getInstance();
            this._taskService = TaskService.getInstance();
        }
    },

    handleCancelButtonAction: {
        value: function (event) {
            var iteration = this.items._findIterationContainingElement(event.target.element);

            if (iteration) {
                this._taskService.abortTask(iteration.object.id);
            }
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

    handleUpdateButtonAction: {
        value: function (event) {
            this._routingService.navigate('/settings/system-section/_/updates');
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
