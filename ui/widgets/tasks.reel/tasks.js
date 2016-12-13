var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DashboardService = require("core/service/dashboard-service").DashboardService;

exports.Tasks = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dashboardService = DashboardService.getInstance();
            this._dashboardService.registerToTasks();
            this._eventDispatcherService.addEventListener(ModelEventName.Task.contentChange, this._handleTasksChange.bind(this));
        }
    },

    _handleTasksChange: {
        value: function(tasks) {
            this.tasks = tasks.toList().toJS();
        }
    }
});
