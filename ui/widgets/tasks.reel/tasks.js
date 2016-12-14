var Component = require("montage/ui/component").Component,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DashboardService = require("core/service/dashboard-service").DashboardService,
    _ = require("lodash");


exports.Tasks = Component.specialize({
    templateDidLoad: {
        value: function() {
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._dashboardService = DashboardService.getInstance();
            this._dashboardService.registerToTasks();
            this._eventDispatcherService.addEventListener(ModelEventName.Task.contentChange, this._handleTasksChange.bind(this));
            this.tasks = [];
        }
    },

    _handleTasksChange: {
        value: function(tasks) {
            // DTM
            var newTasks = _.differenceWith(tasks.toList().toJS(), this.tasks, function(arrVal, othVal) {
                return arrVal.id === othVal.id
            });
            Array.prototype.push.apply(this.tasks, newTasks);
            this.dispatchOwnPropertyChange('tasks', this.tasks);
        }
    }
});
