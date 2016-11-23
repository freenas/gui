var Montage = require("montage").Montage,
    FreeNASService = require("core/service/freenas-service").FreeNASService,
    Promise = require("montage/core/promise").Promise,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    Model = require("core/model/model").Model;

var EMPTY_STRING = '';

var CalendarService = exports.CalendarService = Montage.specialize({
    _instance: {
        value: null
    },

    _dataService: {
        value: null
    },

    _tasks: {
        value: null
    },

    _dataPromise: {
        value: null
    },

    _calendar: {
        value: null
    },

    MONTHS: {
        value: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
    },

    DAYS_OF_WEEK: {
        value: [
            "Sun",
            "Mon",
            "Tues",
            "Wed",
            "Thurs",
            "Fri",
            "Sat"
        ]
    },

// FIXME: Should be a middleware provided enum
    taskCategories: {
        value: [
            { name: "Scrub", value: "volume.scrub", checked: true },
            { name: "Replication", value: "replication.replicate_dataset", checked: true },
            { name: "Smart", value: "disk.parallel_test", checked: true },
            { name: "Update", value: "update.checkfetch", checked: true },
            { name: "Command", value: "calendar_task.command", checked: true },
            { name: "Snapshot", value: "volume.snapshot_dataset", checked: true },
            { name: "Rsync", value: "rsync.copy", checked: true }
        ]
    },

    _tasksPerDay: {
        value: {}
    },

    constructor: {
        value: function() {
            this._dataService = FreeNASService.instance;
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener("calendarTaskUpdated", this._handleTasksChange.bind(this));
            this.addRangeAtPathChangeListener("_tasks", this, "_handleTasksChange");
        }
    },

    getCalendarInstance: {
        value: function() {
            var calendarPromise;
            if (!this._calendar) {
                var self = this;
                calendarPromise = this._dataService.getNewInstanceForType(Model.Calendar).then(function(calendar) {
                    return self._calendar = calendar;
                });
            } else {
                calendarPromise = Promise.resolve(this._calendar);
            }
            return calendarPromise;
        }
    },

    listTasks: {
        value: function() {
            if (this._tasks) {
                return Promise.resolve(this._tasks);
            } else {
                var self = this;
                if (!this._dataPromise) {
                    this._dataPromise = this._dataService.fetchData(Model.CalendarTask).then(function(tasks) {
                        return self._tasks = tasks;
                    });
                }
                return this._dataPromise;
            }
        }
    },

    getTasksRunningOnDay: {
        value: function(day) {
            var self = this,
                tasksPromise;
            if (this._tasks) {
                tasksPromise = Promise.resolve(this._tasks);
            } else {
                tasksPromise = this.listTasks();
            }
            return tasksPromise.then(function(tasks) {
                var task,
                    matchingTasks = [];
                for (var i = 0, length = tasks.length; i < length; i++) {
                    task = tasks[i];
                    if (self._isDayMatchingSchedule(day, task.schedule)) {
                        matchingTasks.push(task);
                    }
                }
                return matchingTasks;
            });
        }
    },

    getTasksScheduleOnDay: {
        value: function(day) {
            var self = this,
                tasksPromise;
            if (this._tasks) {
                tasksPromise = Promise.resolve(this._tasks);
            } else {
                tasksPromise = this.listTasks();
            }
            return tasksPromise.then(function(tasks) {
                return self._buildScheduleFromTasksAndDay(tasks, day);
            }).then(function(schedule) {
                return self._addConcurrentTasksToSchedule(schedule);
            });
        }
    },

    getNewTask: {
        value: function(date, type) {
            var self = this,
                date = date || new Date();
            return this._dataService.getNewInstanceForType(Model.CalendarTask).then(function(task) {
                task.task = type;
                task.schedule = self._dateToSchedule(date);
                task.args = [];
                return task;
            });
        }
    },

    _dateToSchedule: {
        value: function(date) {
            return {
                month:  date.getMonth(),
                day:    date.getDate(),
                hour:   date.getHours(),
                minute: date.getMinutes(),
                day_of_week: date.getDay()
            };
        }
    },

    _addConcurrentTasksToSchedule: {
        value: function(schedule) {
            var task, nextTask,
                timeInMinutes, nextTimeInMinutes,
                j, tasksLength;
            for (var i = 0, length = schedule.length; i < length; i++) {
                task = schedule[i];
                task._concurrentTasks = task._concurrentTasks || [task];
                if (typeof task.hour === 'number' && typeof task.minute === 'number') {
                    timeInMinutes = task.hour * 60 + task.minute;
                    for (j = i+1; j < length; j++) {
                        nextTask = schedule[j];
                        if (nextTask) {
                            nextTask._concurrentTasks = nextTask._concurrentTasks || [nextTask];
                            if (typeof nextTask.hour === 'number' && typeof nextTask.minute === 'number') {
                                nextTimeInMinutes = nextTask.hour * 60 + nextTask.minute;
                                if (nextTimeInMinutes < timeInMinutes + 30) {
                                    task._concurrentTasks.push(nextTask);
                                    nextTask._concurrentTasks.unshift(task);
                                }
                            }
                        }
                    }
                }
            }
            for (var i = 0, length = schedule.length; i < length; i++) {
                task = schedule[i];
                tasksLength = task._concurrentTasks.length;
                task.concurrentEvents = tasksLength;
                for (j = 0; j < tasksLength; j++) {
                    if (task._concurrentTasks[j] == task) {
                        task.concurrentIndex = j;
                        break;
                    }
                }
                delete task._concurrentTasks;
            }
            return schedule;
        }
    },

    _buildScheduleFromTasksAndDay: {
        value: function(tasks, day) {
            var task,
                key = day.year+'-'+day.month+'-'+day.date,
                tasksSchedule = this._tasksPerDay[key] ? this._tasksPerDay[key].tasks : [];
            tasksSchedule.clear();
            for (var i = 0, length = tasks.length; i < length; i++) {
                task = tasks[i];
                if (this._isDayMatchingSchedule(day, task.schedule)) {
                    Array.prototype.push.apply(tasksSchedule, this._getTaskOccurrencesPerDay(task));
                }
            }
            tasksSchedule.sort(this._sortOccurrences);
            if (!this._tasksPerDay[key]) {
                this._tasksPerDay[key] = { day: day, tasks: tasksSchedule, concurrentEvents: 1 };
            }
            return tasksSchedule;
        }
    },

    _getTaskOccurrencesPerDay: {
        value: function(task) {
            var occurrences = [];
            this._iterateHours(task, occurrences);
            return occurrences;
        }
    },

    _sortOccurrences: {
        value: function(a, b) {
            var result = 0;
            if (a.task.enabled && !b.task.enabled) {
                result = -1;
            } else if (!a.task.enabled && b.task.enabled) {
                result = 1;
            } else if (a.hour < b.hour) {
                result = -1;
            } else if (a.hour > b.hour) {
                result = 1;
            } else if (a.hour != '*' && b.hour == '*') {
                result = -1;
            } else if (a.hour == '*' && b.hour != '*') {
                result = 1;
            } else if (a.minute < b.minute) {
                result = -1;
            } else if (a.minute > b.minute) {
                result = 1;
            } else if (a.minute != '*' && b.minute == '*') {
                result = -1;
            } else if (a.minute == '*' && b.minute != '*') {
                result = 1;
            } else if (a.second < b.second) {
                result = -1;
            } else if (a.second > b.second) {
                result = 1;
            } else if (a.second != '*' && b.second == '*') {
                result = -1;
            } else if (a.second == '*' && b.second != '*') {
                result = 1;
            } else if (a.task.name < b.task.name) {
                result = -1;
            } else if (a.task.name > b.task.name) {
                result = 1;
            } else if (a.task.id < b.task.id) {
                result = -1;
            } else if (a.task.id > b.task.id) {
                result = 1;
            }
            return result;
        }
    },

    _iterateHours: {
        value: function(task, occurrences) {
            if (task.schedule.hour == '*') {
                this._iterateMinutes('*', task, occurrences);
            } else {
                for (var hour = 0; hour < 24; hour++) {
                    if (this._isHourMatchingSchedule(hour, task.schedule)) {
                        this._iterateMinutes(hour, task, occurrences);
                    }
                }
            }
        }
    },

    _iterateMinutes: {
        value: function(hour, task, occurrences) {
            if (task.schedule.minute == '*') {
                this._iterateSeconds(hour, '*', task, occurrences);
            } else {
                for (var minute = 0; minute < 60; minute++) {
                    if (this._isMinuteMatchingSchedule(minute, task.schedule)) {
                        this._iterateSeconds(hour, minute, task, occurrences);
                    }
                }
            }
        }
    },

    _iterateSeconds: {
        value: function(hour, minute, task, occurrences) {
            if (task.schedule.second == '*') {
                occurrences.push({
                    hour: hour,
                    minute: minute,
                    second: '*',
                    task: task
                });
            } else {
                for (var second = 0; second < 60; second++) {
                    if (this._isSecondMatchingSchedule(second, task.schedule)) {
                        occurrences.push({
                            hour: hour,
                            minute: minute,
                            second: second,
                            task: task
                        });
                    }
                }
            }
        }
    },

    _isSecondMatchingSchedule: {
        value: function(second, schedule) {
            return  !!schedule &&
                    this._isValueMatchingSchedule(second, schedule.second);
        }
    },

    _isMinuteMatchingSchedule: {
        value: function(minute, schedule) {
            return  !!schedule &&
                    this._isValueMatchingSchedule(minute, schedule.minute);
        }
    },

    _isHourMatchingSchedule: {
        value: function(hour, schedule) {
            return  !!schedule &&
                    this._isValueMatchingSchedule(hour, schedule.hour);
        }
    },

    _isDayMatchingSchedule: {
        value: function(day, schedule) {
            return  !!schedule &&
                    this._isValueMatchingSchedule(day.year, schedule.year) &&
                    this._isValueMatchingSchedule(day.month+1, schedule.month) &&
                    this._isValueMatchingSchedule(day.date, schedule.day) &&
                    this._isValueMatchingSchedule(day.day, schedule.day_of_week);
        }
    },

    _isValueMatchingSchedule: {
        value: function(value, schedule) {
            if (typeof schedule !== "string") {
                schedule = EMPTY_STRING + schedule;
            }
            var parts = schedule.split(','),
                part;
            for (var i = 0, length = parts.length; i < length; i++) {
                part = parts[i];
                if (part == '*' || part == value) {
                    return true;
                } else if (part.indexOf('/') != -1) {
                    var period = +part.split('/')[1];
                    if (value % period === 0) {
                        return true;
                    }
                }
            }
        }
    },

    _handleTasksChange: {
        value: function() {
            var days = Object.keys(this._tasksPerDay);
            for (var i = 0, length = days.length; i < length; i++) {
                this._refreshTaskSchedule(this._tasksPerDay[days[i]]);
            }
        }
    },

    _refreshTaskSchedule: {
        value: function(taskSchedule) {
            this.getTasksScheduleOnDay(taskSchedule.day);
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new CalendarService();
            }
            return this._instance;
        }
    }
});
