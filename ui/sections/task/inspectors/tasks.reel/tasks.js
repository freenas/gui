/**
 * @module ui/sections/task/inspectors/tasks.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    TaskService = require("core/service/task-service").TaskService;

/**
 * @class Tasks
 * @extends AbstractInspector
 */
exports.Tasks = AbstractInspector.specialize(/** @lends Tasks# */ {
    stateOptions: {
        value: [
            "CREATED",
            "WAITING",
            "EXECUTING",
            "ROLLBACK",
            "FINISHED",
            "FAILED",
            "ABORTED"
        ]
    },

    templateDidLoad: {
        value: function () {
            var self = this;
                this.filter = {};
            this._service = TaskService.getInstance();
            this._service.listTasks().then(function (entries) {
                self.tasks = entries;
            });
        }
    },

    handleClearAction: {
        value: function () {
            this.filter = {};
        }
    },

    handleApplyAction: {
        value:function() {
            var self = this,
                filter = {};
            if (this.filter.id) {
                filter.id = this.filter.id;
            }
            if (this.filter.name) {
                filter.name = this.filter.name;
            }
            if (this.filter.state) {
                filter.state = this.filter.state;
            }
            // FIXME: add the right stuff here
            if (this.filter.started_after) {
                filter.started_at = this.filter.started_after;
            }
            this._service.findTasks(filter).then(function (entries) {
                self.tasks = entries;
            })
        }
    }
});
