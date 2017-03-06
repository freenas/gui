var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent;

exports.CalendarWidgetDay = AbstractDropZoneComponent.specialize({
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
                    this.application.sectionService.getTasksScheduleOnDay(data).then(function(tasks) {
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
            if (document.documentElement.clientHeight > 920) {
                this._maxDisplayedLines = 3
            } else {
                this._maxDisplayedLines = 2
            }
        }
    },

    templateDidLoad: {
        value: function() {
            this.super();
            this._calendarService = this.application.calendarService;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (isFirstTime) {
                this.addRangeAtPathChangeListener("taskCategories", this, "_filterDistinctTasks");
                this.addRangeAtPathChangeListener("tasks", this, "_filterDistinctTasks");
                window.addEventListener("resize", this, false);
            }
            this._setMaxDisplayedLines();
        }
    },

    exitDocument: {
        value: function() {
            window.removeEventListener("resize", this, false);
        }
    },

    handleResize: {
        value: function() {
            this._setMaxDisplayedLines();
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
    },

    shouldAcceptComponent: {
        value: function() {
            return this.data.isCurrentMonth;
        }
    },

    handleComponentDrop: {
        value: function(taskCategoryComponent) {
            var self = this;
            this._calendarService.getNewTask(this.data.rawDate, taskCategoryComponent.object.value).then(function(task) {
                self.selectedTask = task;
            });
        }
    }

});
