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
            this.filter.started_before = new Date();
            this.handleApplyAction();
        }
    },

    handleClearAction: {
        value: function () {
            this.filter = {};
        }
    },

    handleAllAction: {
        value: function () {
            self.tasks = self._tasks;
        }
    },

    handleTodayAction: {
        value: function () {
            this.filter.started_before = new Date();
        }
    },


    handleApplyAction: {
        value:function() {
            var self = this,
                filter = {};
                filter.started_at = [];
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
                filter.started_at.push({
                    operator : ">=",
                    value: {$date: this.filter.started_after.toISOString().replace('Z', '000')},
                    _isCustom: true
                });
                filter.started_at._isCustom = true;
            }
            if (this.filter.started_before) {
                filter.started_at.push({
                    operator : "<=",
                    value: {$date: this.filter.started_before.toISOString().replace('Z', '000')},
                    _isCustom: true
                });
                filter.started_at._isCustom = true;
            }
            this._service.findTasks(filter).then(function (entries) {
                self.tasks = entries;
                self._tasks = entries;
            })
        }
    }
});
