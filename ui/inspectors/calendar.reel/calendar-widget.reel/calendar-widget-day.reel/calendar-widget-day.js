/**
 * @module ui/calendar-widget-day.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class CalendarWidgetDay
 * @extends Component
 */
exports.CalendarWidgetDay = Component.specialize({
    _tasks: {
        value: null
    },

    tasks: {
        get: function() {
            return this._tasks;
        },
        set: function(tasks) {
            if (this._tasks !== tasks) {
                this._tasks = tasks;
                this._filterDistinctTasks();
            }
        }
    },

    _taskCategories: {
        value: null
    },

    taskCategories: {
        get: function() {
            return this._taskCategories;
        },
        set: function(taskCategories) {
            if (this._taskCategories !== taskCategories) {
                this._taskCategories = taskCategories;
                this._filterDistinctTasks();
            }
        }
    },

    _data: {
        value: null
    },

    data: {
        get: function() {
            return this._data;
        },
        set: function(data) {
            if (this._data !== data) {
                this._data = data;
                if (data) {
                    var self = this;
                    this.application.calendarService.getTasksScheduleOnDay(data).then(function(tasks) {
                        self.tasks = tasks;
                    });
                }
            }
        }
    },

    _allTasksVisible: {
        value: false
    },

    _setMaxDisplayedLines: {
        value: function () {
            if (document.documentElement.clientHeight > 1120) {
                this._maxDisplayedLines = 3
            }
        }
    },

    enterDocument: {
        value: function() {
            this.addRangeAtPathChangeListener("taskCategories", this, "_filterDistinctTasks");
            this.addRangeAtPathChangeListener("tasks", this, "_filterDistinctTasks");
            this._setMaxDisplayedLines();
        }
    },

    prepareForActivationEvents: {
        value: function() {
            var pressComposer = new PressComposer();
            this.addComposer(pressComposer);
            pressComposer.addEventListener("press", this);
            this.element.addEventListener("mouseover", this);
        }
    },

    handlePress: {
        value: function () {
/*
            var self = this;
            this.selectedDay = this.data;
            this.application.calendarService.getNewTask(this.data.rawDate).then(function(task) {
                self.selectedTask = task;
            });
*/
        }
    },

    _handleTaskCategoriesChange: {
        value: function() {
            this._filterDistinctTasks();
        }
    },

    _filterDistinctTasks: {
        value: function() {
            if (this._tasks && this._taskCategories) {
                var self = this;
                this.distinctTasks = this._tasks
                    .filter(function(x) {
                        var category = self._taskCategories.filter(function(y) {
                            return x.task.task === y.value;
                        })[0];
                        return category;
                    })
                    .map(function(x) {
                        return x.task;
                    })
                    .reduce(function(a,b) {
                        if (a.indexOf(b) == -1) {
                            a.push(b);
                        }
                        return a;
                    }, []);
            }
        }
    },

    handleMoreTasksButtonAction: {
        value: function () {
            this._allTasksVisible = !this._allTasksVisible;
        }
    }
});
