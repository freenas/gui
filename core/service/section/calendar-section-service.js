var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService,
    MiddlewareTaskRepository = require("core/repository/middleware-task-repository").MiddlewareTaskRepository,
    Model = require("core/model/model").Model;

exports.CalendarSectionService = AbstractSectionService.specialize({
    init: {
        value: function(middlewareTaskRepository) {
            this._middlewareTaskRepository = middlewareTaskRepository || MiddlewareTaskRepository.instance;
            this.SCHEDULE_OPTIONS = this.constructor.SCHEDULE_OPTIONS;
            this.DAYS_OF_WEEK = this.constructor.DAYS_OF_WEEK;
            this.MONTHS = this.constructor.MONTHS;
            this.DAYS = this.constructor.DAYS;
            this.HOURS = this.constructor.HOURS;
            this.MINUTES = this.constructor.MINUTES;
            var self = this;
            return Model.populateObjectPrototypeForType(Model.CalendarTask).then(function () {
                self._calendarTaskService = Model.CalendarTask.objectPrototype.services;
            });
        }
    },

    initializeCalendarTask: {
        value: function(task, parentView) {
            this._extractSchedule(task, parentView);
            if (!Array.isArray(task.args)) {
                task.args = [];
            }
            task.args.__type = task.task;
        }
    },

    updateScheduleOnTask: {
        value: function(task) {
            var schedule;
            if (task._simpleSchedule && task._simpleSchedule.type !== this.SCHEDULE_OPTIONS.CUSTOM.value) {
                schedule = task._simpleSchedule;
                task.schedule = {
                    year: '*',
                    month: '*',
                    day: '*',
                    day_of_week: '*',
                    hour: schedule.time ? schedule.time.getHours() : 0,
                    minute: schedule.time ? schedule.time.getMinutes() : 0,
                    second: 0

                };
                if (schedule.type === this.SCHEDULE_OPTIONS.WEEKLY.value) {
                    task.schedule.day_of_week = schedule.daysOfWeek.map(function(x) { return x.index; }).join(',');
                } else if (schedule.type === this.SCHEDULE_OPTIONS.MONTHLY.value) {
                    task.schedule.day = schedule.daysOfMonth.join(',');
                }
            } else {
                schedule = task._customSchedule;
                task.schedule = {
                    year: '*',
                    month: schedule.month.length > 0 ? schedule.month.map(function(x) { return x.index; }).join(',') : '*',
                    day: schedule.daysOfMonth.length > 0 ? schedule.daysOfMonth.join(',') : '*',
                    day_of_week: '*',
                    hour: schedule.hour.length > 0 ? schedule.hour.join(',') : 0,
                    minute: schedule.minute.length > 0 ? schedule.minute.join(',') : 0,
                    second: 0
                };
            }
        }
    },

    getScheduleStringForTask: {
        value: function(task) {
            if (task._simpleSchedule && task._simpleSchedule.type) {
                var type = task._simpleSchedule.type;
                if (type === this.SCHEDULE_OPTIONS.CUSTOM.value) {
                    return this.SCHEDULE_OPTIONS.CUSTOM.stringTemplate;
                } else if (task._simpleSchedule.time) {
                    var time = task._simpleSchedule.time.toLocaleTimeString(),
                        days = type === this.SCHEDULE_OPTIONS.WEEKLY.value ?    
                        task._simpleSchedule.daysOfWeek.map(function(x) { return x.label; }) : 
                        type === this.SCHEDULE_OPTIONS.MONTHLY.value ? 
                        task._simpleSchedule.daysOfMonth.sort(function(a, b) { return parseInt(a) - parseInt(b); }) : 
                        [];

                    return this.SCHEDULE_OPTIONS[task._simpleSchedule.type].stringTemplate
                        .replace('{days}', days.join(', '))
                        .replace('{time}', time);
                }
            }
            return '';
        }
    },

    runTask: {
        value: function(task) {
            if (task._isNew) {
                var self = this;
                this._middlewareTaskRepository.getNewMiddlewareTaskWithNameAndArgs(task.task, task.args).then(function(middlewareTask) {
                    return self._middlewareTaskRepository.runMiddlewareTask(middlewareTask);
                });
                
            } else {
                return this._calendarTaskService.run(task.id);
            }
        }
    },

    _extractSchedule: {
        value: function(task, parentView) {
            if (!task._simpleSchedule) {
                task._simpleSchedule = {};
                if (task._isNew) {
                    if (task.schedule) {
                        this._extractNewSchedule(task, parentView);
                    } else {
                        this._setDefaultSchedule(task, parentView);
                    }
                } else if (task.schedule) {
                    this._extractExistingSchedule(task);
                }
            }
        }
    },

    _setDefaultSchedule: {
        value: function(task, parentView) {
            if (parentView === 'month') {
                task._simpleSchedule.type = this.SCHEDULE_OPTIONS.MONTHLY.value;
            } else if (parentView === 'week') {
                task._simpleSchedule.type = this.SCHEDULE_OPTIONS.WEEKLY.value;
            } else if (parentView === 'day') {
                task._simpleSchedule.type = this.SCHEDULE_OPTIONS.DAILY.value;
            }
            var now = new Date();
            task._simpleSchedule.daysOfMonth = this._getValues(now.getDate(), this.constructor.DAYS);
            task._simpleSchedule.daysOfWeek = this._getValues(now.getDay(), this.constructor.DAYS_OF_WEEK);
            task._customSchedule.daysOfMonth = this._getValues(now.getDate(), this.constructor.DAYS);
            task._customSchedule.month = this._getValues(now.getMonth(), this.constructor.MONTHS);
            task._customSchedule.hour = this._getValues(now.getHours(), this.constructor.HOURS);
            task._customSchedule.minute = this._getValues(now.getMinutes(), this.constructor.MINUTES);
            var time = new Date();
            time.setSeconds(0);
            task._simpleSchedule.time = time;
        }
    },

    _extractNewSchedule: {
        value: function(task, parentView) {
            if (parentView === 'month') {
                task._simpleSchedule.type = this.SCHEDULE_OPTIONS.MONTHLY.value;
                var time = new Date();
                time.setSeconds(0);
                task._simpleSchedule.time = time;
            } else {
                task._simpleSchedule.time = this._getScheduleTime(task.schedule);
                if (parentView === 'week') {
                    task._simpleSchedule.type = this.SCHEDULE_OPTIONS.WEEKLY.value;
                } else if (parentView === 'day') {
                    task._simpleSchedule.type = this.SCHEDULE_OPTIONS.DAILY.value;
                }
            }
            var now = new Date();
            task._simpleSchedule.daysOfMonth = this._getValues(task.schedule.day, this.constructor.DAYS);
            task._simpleSchedule.daysOfWeek = this._getValues(task.schedule.day_of_week, this.constructor.DAYS_OF_WEEK);
        }
    },

    _extractExistingSchedule: {
        value: function(task) {
            if (this._isDaily(task.schedule)) {
                this._extractExistingDailySchedule(task);
            } else if (this._isWeekly(task.schedule)) {
                this._extractExistingWeeklySchedule(task);
            } else if (this._isMonthly(task.schedule)) {
                this._extractExistingMonthlySchedule(task);
            } else {
                this._extractExistingCustomSchedule(task);
            }
        }
    },

    _extractExistingDailySchedule: {
        value: function(task) {
            task._simpleSchedule.type = this.SCHEDULE_OPTIONS.DAILY.value;
            task._simpleSchedule.daysOfMonth = this._getValues(new Date().getDate(), this.constructor.DAYS);
            task._simpleSchedule.daysOfWeek = this._getValues(new Date().getDay(), this.constructor.DAYS_OF_WEEK);
            task._simpleSchedule.time = this._getScheduleTime(task.schedule);
        }
    },

    _extractExistingWeeklySchedule: {
        value: function(task) {
            task._simpleSchedule.type = this.SCHEDULE_OPTIONS.WEEKLY.value;
            task._simpleSchedule.daysOfMonth = this._getValues(new Date().getDate(), this.constructor.DAYS);
            task._simpleSchedule.daysOfWeek = this._getValues(task.schedule.day_of_week, this.constructor.DAYS_OF_WEEK);
            task._simpleSchedule.time = this._getScheduleTime(task.schedule);
        }
    },

    _extractExistingMonthlySchedule: {
        value: function(task) {
            task._simpleSchedule.type = this.SCHEDULE_OPTIONS.MONTHLY.value;
            task._simpleSchedule.daysOfMonth = this._getValues(task.schedule.day, this.constructor.DAYS);
            task._simpleSchedule.daysOfWeek = this._getValues(new Date().getDay(), this.constructor.DAYS_OF_WEEK);
            task._simpleSchedule.time = this._getScheduleTime(task.schedule);
        }
    },

    _extractExistingCustomSchedule: {
        value: function(task) {
            task._simpleSchedule.type = this.SCHEDULE_OPTIONS.CUSTOM.value;
            task._simpleSchedule.daysOfMonth = this._getValues(new Date().getDate(), this.constructor.DAYS);
            task._simpleSchedule.daysOfWeek = this._getValues(new Date().getDay(), this.constructor.DAYS_OF_WEEK);
            task._customSchedule.month = this._getValues(task.schedule.month, this.constructor.MONTHS);
            task._customSchedule.daysOfMonth = this._getValues(task.schedule.day, this.constructor.DAYS);
            task._customSchedule.hour = this._getValues(task.schedule.hour, this.constructor.HOURS);
            task._customSchedule.minute = this._getValues(task.schedule.minute, this.constructor.MINUTES);
        }
    },

    _isMonthly: {
        value: function(schedule) {
            return  !this._isEvery(schedule.day) &&
                this._isEvery(schedule.day_of_week) &&
                this._isEvery(schedule.month) &&
                this._isSingleValue(schedule.hour) &&
                this._isSingleValue(schedule.minute) &&
                this._isSingleValue(schedule.second);
        }
    },

    _isWeekly: {
        value: function(schedule) {
            return  this._isEvery(schedule.day) &&
                !this._isEvery(schedule.day_of_week) &&
                this._isEvery(schedule.month) &&
                this._isSingleValue(schedule.hour) &&
                this._isSingleValue(schedule.minute) &&
                this._isSingleValue(schedule.second);
        }
    },

    _isDaily: {
        value: function(schedule) {
            return  this._isEvery(schedule.day) &&
                this._isEvery(schedule.day_of_week) &&
                this._isEvery(schedule.month) &&
                this._isSingleValue(schedule.hour) &&
                this._isSingleValue(schedule.minute) &&
                this._isSingleValue(schedule.second);
        }
    },

    _getValues: {
        value: function(string, options) {
            string = ''+string;
            var values = new Set();
            if (typeof string === 'string') {
                var option,
                    entries = string.split(','),
                    entry,
                    j, matchingOptions;
                for (var i = 0, length = entries.length; i < length; i++) {
                    entry = entries[i];
                    if (entry.indexOf('/') === -1) {
                        entry = parseInt(entry);
                        matchingOptions = options.filter(function(x) { return x.index === entry; });
                        if (matchingOptions.length === 1) {
                            values.add(matchingOptions[0].value);
                        }
                    } else {
                        var frequency = parseInt(entry.split('/')[1]);
                        options.filter(function(opt, idx) { return idx % frequency === 0; }).map(function(x) {
                            values.add(x.value);
                        });
                    }
                }
            } else if (typeof string === 'number') {
                values.add(string);
            }
            return Array.from(values).sort();
        }
    },

    _getScheduleTime: {
        value: function(schedule) {
            var scheduleTime = new Date(0);
            scheduleTime.setHours(schedule.hour);
            scheduleTime.setMinutes(schedule.minute);
            return scheduleTime;
        }
    },

    _isEvery: {
        value: function(value) {
            return typeof value === 'undefined' || value === '*';
        }
    },

    _isSingleValue: {
        value: function(value) {
            return  typeof value === 'string' &&
                value.indexOf('/') === -1 &&
                value.indexOf(',') === -1;
        }
    }
}, {
    SCHEDULE_OPTIONS: {
        value: {
            MONTHLY:    {
                value: 'MONTHLY',
                label: 'every month',
                stringTemplate: "Monthly on {days} at {time}."
            },
            WEEKLY:     {
                value: 'WEEKLY',
                label: 'every week',
                stringTemplate: "Weekly on {days} at {time}."
            },
            DAILY:      {
                value: 'DAILY',
                label: 'every day',
                stringTemplate: "Daily at {time}."
            },
            CUSTOM:     {
                value: 'CUSTOM',
                label: 'custom',
                stringTemplate: "Custom schedule, see dedicated panel."
            }
        }
    },

    _MINUTES: {
        value: null
    },

    MINUTES: {
        get: function() {
            if (!this._MINUTES) {
                this._MINUTES = this._getIntegerSeries(0, 59);
            }
            return this._MINUTES;
        }
    },

    _HOURS: {
        value: null
    },

    HOURS: {
        get: function() {
            if (!this._HOURS) {
                this._HOURS = this._getIntegerSeries(0, 23);
            }
            return this._HOURS;
        }
    },

    _DAYS: {
        value: null
    },

    DAYS: {
        get: function() {
            if (!this._DAYS) {
                this._DAYS = this._getIntegerSeries(1, 31);
            }
            return this._DAYS;
        }
    },

    MONTHS: {
        value: [
            {
                value: {
                    label: "January",
                    index: 0
                }, 
                label: "Jan", 
                index: 0
            },
            {
                value: {
                    label: "February",
                    index: 1
                }, 
                label: "Feb", 
                index: 1
            },
            {
                value: {
                    label: "March",
                    index: 2
                }, 
                label: "Mar", 
                index: 2
            },
            {
                value: {
                    label: "April",
                    index: 3
                }, 
                label: "Apr", 
                index: 3
            },
            {
                value: {
                    label: "May",
                    index: 4
                }, 
                label: "May", 
                index: 4
            },
            {
                value: {
                    label: "June",
                    index: 5
                }, 
                label: "Jun", 
                index: 5
            },
            {
                value: {
                    label: "July",
                    index: 6
                }, 
                label: "Jul", 
                index: 6
            },
            {
                value: {
                    label: "August",
                    index: 7
                }, 
                label: "Aug", 
                index: 7
            },
            {
                value: {
                    label: "September",
                    index: 8
                }, 
                label: "Sep", 
                index: 8
            },
            {
                value: {
                    label: "October",
                    index: 9
                }, 
                label: "Oct", 
                index: 9
            },
            {
                value: {
                    label: "November",
                    index: 10
                }, 
                label: "Nov", 
                index: 10
            },
            {
                value: {
                    label: "December",
                    index: 11
                }, 
                label: "Dec", 
                index: 11
            }
        ]
    },

    DAYS_OF_WEEK: {
        value: [
            {
                value: {
                    label: "Sunday",
                    index: 0
                },
                label: "S", 
                index: 0
            },
            {
                value: {
                    label: "Monday",
                    index: 1
                },
                label: "M", 
                index: 1
            },
            {
                value: {
                    label: "Tuesday",
                    index: 2
                },
                label: "T", 
                index: 2
            },
            {
                value: {
                    label: "Wednesday",
                    index: 3
                },
                label: "W", 
                index: 3
            },
            {
                value: {
                    label: "Thursday",
                    index: 4
                },
                label: "Th", 
                index: 4
            },
            {
                value: {
                    label: "Friday",
                    index: 5
                },
                label: "F", 
                index: 5
            },
            {
                value: {
                    label: "Saturday",
                    index: 6
                },
                label: "S", 
                index: 6
            }
        ]
    },

    _getIntegerSeries: {
        value: function(start, end) {
            var series = [];
            for (var i = start; i <= end; i++) {
                series.push({
                    label: i,
                    value: i,
                    index: i
                });
            }
            return series;
        }
    }
});
