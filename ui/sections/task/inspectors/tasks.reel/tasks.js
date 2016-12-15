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

        }
    },

    enterDocument: {
        value: function () {
            this.selectedTab = "EXECUTING";
            this.filter.started_after = new Date(new Date().setDate(new Date().getDate()-1));
            this.filter.finished_at = new Date();
            this.handleApplyAction();
        }
    },

    handleClearAction: {
        value: function () {
            this.filter = {};
        }
    },

    handleExecutingAction: {
        value: function () {
            this.tasks = this.generateFilterList("EXECUTING");
        }
    },

    handleFailedAction: {
        value: function () {
            this.tasks = this.generateFilterList("FAILED");
        }
    },

    handleFinishedAction: {
        value: function () {
            this.tasks = this.generateFilterList("FINISHED");
        }
    },

    handleWaitingAction: {
        value: function () {
            this.tasks = this.generateFilterList("WAITING");
        }
    },

    handleAbortedAction: {
        value: function () {
            this.tasks = this.generateFilterList("ABORTED");
        }
    },

    handleAllAction: {
        value: function () {
            self.tasks = self._tasks;
        }
    },

    handleTodayAction: {
        value: function () {
            this.filter.finished_at = new Date();
        }
    },


    handleApplyAction: {
        value:function() {
            var self = this,
                filter = {};
            if (this.filter.id) {
                filter.id = this.filter.id;
            }
            if (this.filter.name && this.filter.regex) {
                filter.name = {
                    operator : "~",
                    value : this.filter.name,
                    _isCustom: true
                }
            }else if (this.filter.name) {
                filter.name = this.filter.name;
            }
            // FIXME: add the right stuff here
            if (this.filter.started_after) {
                filter.started_at = {
                    operator : ">=",
                    value: {$date: this.filter.started_after.toISOString().replace('Z', '000')},
                    _isCustom: true
                }
            }
            if (this.filter.finished_at) {
                filter.finished_at = {
                    operator : "<=",
                    value: {$date: this.filter.finished_at.toISOString().replace('Z', '000')},
                    _isCustom: true
                }
            }
            this._service.findTasks(filter).then(function (entries) {
                self.tasks = entries;
                self._tasks = entries;
            })
        }
    },

    generateFilterList: {
        value: function (state) {
            return this._tasks.filter(function (task) {
                return task.state === state;
            })
        }
    }
});
