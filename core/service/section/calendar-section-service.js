var AbstractSectionService = require("core/service/section/abstract-section-service").AbstractSectionService;

exports.CalendarSectionService = AbstractSectionService.specialize({
    init: {
        value: function() {
            this.SCHEDULE_OPTIONS = this.constructor.SCHEDULE_OPTIONS;
        }
    },

    initializeCalendarTask: {
        value: function(task) {
            this._extractSchedule(task);
            if (!Array.isArray(task.args)) {
                task.args = [];
            }
            task.args.__type = task.task;
        }
    },

    updateScheduleOnTask: {
        value: function(task) {
            if (task._simpleSchedule && task._simpleSchedule.type !== this.SCHEDULE_OPTIONS.CUSTOM.value) {
                task.schedule = {
                    year: '*',
                    month: '*',
                    day: '*',
                    day_of_week: '*',
                    hour: task._simpleSchedule.time ? task._simpleSchedule.time.getHours() : 0,
                    minute: task._simpleSchedule.time ? task._simpleSchedule.time.getMinutes() : 0,
                    second: 0
                };
                if (task._simpleSchedule.type === this.SCHEDULE_OPTIONS.WEEKLY.value) {
                    task.schedule.day_of_week = task._simpleSchedule.daysOfWeek.join(',');
                } else if (task._simpleSchedule.type === this.SCHEDULE_OPTIONS.MONTHLY.value) {
                    task.schedule.day = task._simpleSchedule.daysOfMonth.join(',');
                }
            }
        }
    },

    _extractSchedule: {
        value: function(task) {
            if (!task._simpleSchedule) {
                task._simpleSchedule = {};
                if (task.schedule) {
                    if (this._isDaily(task.schedule)) {
                        task._simpleSchedule.type = this.SCHEDULE_OPTIONS.DAILY.value;
                        task._simpleSchedule.time = this._getScheduleTime(task.schedule);
                    } else if (this._isWeekly(task.schedule)) {
                        task._simpleSchedule.type = this.SCHEDULE_OPTIONS.WEEKLY.value;
                        task._simpleSchedule.daysOfWeek = this._getValues(task.schedule.day_of_week, this.constructor.DAYS_OF_WEEK);
                        task._simpleSchedule.time = this._getScheduleTime(task.schedule);
                    } else if (this._isMonthly(task.schedule)) {
                        task._simpleSchedule.type = this.SCHEDULE_OPTIONS.MONTHLY.value;
                        task._simpleSchedule.daysOfMonth = this._getValues(task.schedule.day, this.constructor.DAYS);
                        task._simpleSchedule.time = this._getScheduleTime(task.schedule);
                    }
                }
            }
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
            var values = new Set(),
                option,
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
            return Array.from(values);
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
                label: 'every month'
            },
            WEEKLY:     {
                value: 'WEEKLY',
                label: 'every week'
            },
            DAILY:      {
                value: 'DAILY',
                label: 'every day'
            },
            CUSTOM:     {
                value: 'CUSTOM',
                label: 'custom'
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

    DAYS_OF_WEEK: {
        value: [
            {
                label: "S", 
                value: "sunday", 
                index: 0
            },
            {
                label: "M", 
                value: "monday", 
                index: 1
            },
            {
                label: "T", 
                value: "tuesday", 
                index: 2
            },
            {
                label: "W", 
                value: "wednesday", 
                index: 3
            },
            {
                label: "Th", 
                value: "thursday", 
                index: 4
            },
            {
                label: "F", 
                value: "friday", 
                index: 5
            },
            {
                label: "S", 
                value: "saturday", 
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
