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
                    task.schedule.day_of_week = schedule.daysOfWeek.join(',');
                } else if (schedule.type === this.SCHEDULE_OPTIONS.MONTHLY.value) {
                    task.schedule.day = schedule.daysOfMonth.join(',');
                }
            } else {
                schedule = task._customSchedule;
                task.schedule = {
                    year: '*',
                    month: schedule.month.length > 0 ? schedule.month.join(',') : '*',
                    day: schedule.daysOfMonth.length > 0 ? schedule.daysOfMonth.join(',') : '*',
                    day_of_week: '*',
                    hour: schedule.hour.length > 0 ? schedule.hour.join(',') : 0,
                    minute: schedule.minute.length > 0 ? schedule.minute.join(',') : 0,
                    second: 0
                };
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
                    } else {
                        task._simpleSchedule.type = this.SCHEDULE_OPTIONS.CUSTOM.value;
                        task._customSchedule.month = this._getValues(task.schedule.month, this.constructor.MONTHS);
                        task._customSchedule.daysOfMonth = this._getValues(task.schedule.day, this.constructor.DAYS);
                        task._customSchedule.hour = this._getValues(task.schedule.hour, this.constructor.HOURS);
                        task._customSchedule.minute = this._getValues(task.schedule.minute, this.constructor.MINUTES);
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

    MONTHS: {
        value: [
            {
                value: 0, 
                label: "Jan", 
                index: 0
            },
            {
                value: 1, 
                label: "Feb", 
                index: 1
            },
            {
                value: 2, 
                label: "Mar", 
                index: 2
            },
            {
                value: 3, 
                label: "Apr", 
                index: 3
            },
            {
                value: 4, 
                label: "May", 
                index: 4
            },
            {
                value: 5, 
                label: "Jun", 
                index: 5
            },
            {
                value: 6, 
                label: "Jul", 
                index: 6
            },
            {
                value: 7, 
                label: "Aug", 
                index: 7
            },
            {
                value: 8, 
                label: "Sep", 
                index: 8
            },
            {
                value: 9, 
                label: "Oct", 
                index: 9
            },
            {
                value: 10, 
                label: "Nov", 
                index: 10
            },
            {
                value: 11, 
                label: "Dec", 
                index: 11
            }
        ]
    },

    DAYS_OF_WEEK: {
        value: [
            {
                label: "S", 
                value: 0, 
                index: 0
            },
            {
                label: "M", 
                value: 1, 
                index: 1
            },
            {
                label: "T", 
                value: 2, 
                index: 2
            },
            {
                label: "W", 
                value: 3, 
                index: 3
            },
            {
                label: "Th", 
                value: 4, 
                index: 4
            },
            {
                label: "F", 
                value: 5, 
                index: 5
            },
            {
                label: "S", 
                value: 6, 
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
