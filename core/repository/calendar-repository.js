"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var calendar_dao_1 = require("../dao/calendar-dao");
var calendar_task_dao_1 = require("../dao/calendar-task-dao");
var _ = require("lodash");
var Promise = require("bluebird");
var model_event_name_1 = require("../model-event-name");
var CalendarRepository = (function (_super) {
    __extends(CalendarRepository, _super);
    function CalendarRepository(calendarDao, calendarTaskDao) {
        var _this = _super.call(this, [
            'Calendar',
            'CalendarTask'
        ]) || this;
        _this.calendarDao = calendarDao;
        _this.calendarTaskDao = calendarTaskDao;
        _this.tasksPerDay = {};
        return _this;
    }
    CalendarRepository.getInstance = function () {
        if (!CalendarRepository.instance) {
            CalendarRepository.instance = new CalendarRepository(new calendar_dao_1.CalendarDao(), new calendar_task_dao_1.CalendarTaskDao());
        }
        return CalendarRepository.instance;
    };
    CalendarRepository.prototype.getNewCalendarInstance = function () {
        return this.calendarDao.getNewInstance();
    };
    CalendarRepository.prototype.getTasksScheduleOnDay = function (day) {
        var self = this;
        return this.listTasks().then(function (tasks) {
            return self.buildScheduleFromTasksAndDay(tasks, day);
        }).then(function (schedule) {
            return self.addConcurrentTasksToSchedule(schedule);
        });
    };
    CalendarRepository.prototype.listTasks = function () {
        return this.calendarTasks ?
            Promise.resolve(this.calendarTasks.toList().toJS()) :
            this.calendarTaskDao.list();
    };
    CalendarRepository.prototype.addConcurrentTasksToSchedule = function (schedule) {
        var task, nextTask, timeInMinutes, nextTimeInMinutes, j, tasksLength;
        for (var i = 0, length = schedule.length; i < length; i++) {
            task = schedule[i];
            task._concurrentTasks = task._concurrentTasks || [task];
            if (typeof task.hour === 'number' && typeof task.minute === 'number') {
                timeInMinutes = task.hour * 60 + task.minute;
                for (j = i + 1; j < length; j++) {
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
    };
    CalendarRepository.prototype.initializeTask = function (task, view) {
        this.extractSchedule(task, view);
        if (!Array.isArray(task.args)) {
            task.args = [];
        }
        task.args.__type = task.task;
    };
    CalendarRepository.prototype.getScheduleStringForTask = function (task) {
        if (task._simpleSchedule && task._simpleSchedule.type) {
            var type = task._simpleSchedule.type;
            if (type === CalendarRepository.SCHEDULE_OPTIONS.CUSTOM.value) {
                return CalendarRepository.SCHEDULE_OPTIONS.CUSTOM.stringTemplate;
            }
            else if (task._simpleSchedule.time) {
                var time = task._simpleSchedule.time.toLocaleTimeString(), days = type === CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value ?
                    task._simpleSchedule.daysOfWeek.map(function (x) { return x.label; }) :
                    type === CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value ?
                        task._simpleSchedule.daysOfMonth.sort(function (a, b) { return parseInt(a) - parseInt(b); }) :
                        [];
                return CalendarRepository.SCHEDULE_OPTIONS[task._simpleSchedule.type].stringTemplate
                    .replace('{days}', days.join(', '))
                    .replace('{time}', time);
            }
        }
        return '';
    };
    CalendarRepository.prototype.updateScheduleOnTask = function (task) {
        var schedule;
        if (task._simpleSchedule && task._simpleSchedule.type !== CalendarRepository.SCHEDULE_OPTIONS.CUSTOM.value) {
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
            if (schedule.type === CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value) {
                task.schedule.day_of_week = schedule.daysOfWeek.map(function (x) { return x.index; }).join(',');
            }
            else if (schedule.type === CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value) {
                task.schedule.day = schedule.daysOfMonth.join(',');
            }
        }
        else {
            schedule = task._customSchedule;
            task.schedule = {
                year: '*',
                month: schedule.month.length > 0 ? schedule.month.map(function (x) { return x.index; }).join(',') : '*',
                day: schedule.daysOfMonth.length > 0 ? schedule.daysOfMonth.join(',') : '*',
                day_of_week: '*',
                hour: schedule.hour.length > 0 ? schedule.hour.join(',') : 0,
                minute: schedule.minute.length > 0 ? schedule.minute.join(',') : 0,
                second: 0
            };
        }
    };
    CalendarRepository.prototype.extractSchedule = function (task, view) {
        if (!task._simpleSchedule) {
            task._simpleSchedule = {};
            if (task._isNew) {
                if (task.schedule) {
                    this.extractNewSchedule(task, view);
                }
                else {
                    this.setDefaultSchedule(task, view);
                }
            }
            else if (task.schedule) {
                this.extractExistingSchedule(task);
            }
        }
    };
    CalendarRepository.prototype.extractExistingSchedule = function (task) {
        if (this.isDaily(task.schedule)) {
            this.extractExistingDailySchedule(task);
        }
        else if (this.isWeekly(task.schedule)) {
            this.extractExistingWeeklySchedule(task);
        }
        else if (this.isMonthly(task.schedule)) {
            this.extractExistingMonthlySchedule(task);
        }
        else {
            this.extractExistingCustomSchedule(task);
        }
    };
    CalendarRepository.prototype.setDefaultSchedule = function (task, view) {
        if (view === 'month') {
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value;
        }
        else if (view === 'week') {
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value;
        }
        else if (view === 'day') {
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.DAILY.value;
        }
        var now = new Date();
        task._simpleSchedule.daysOfMonth = this.getValues(now.getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(now.getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._customSchedule.daysOfMonth = this.getValues(now.getDate(), CalendarRepository.DAYS);
        task._customSchedule.month = this.getValues(now.getMonth(), CalendarRepository.MONTHS);
        task._customSchedule.hour = this.getValues(now.getHours(), CalendarRepository.HOURS);
        task._customSchedule.minute = this.getValues(now.getMinutes(), CalendarRepository.MINUTES);
        var time = new Date();
        time.setSeconds(0);
        task._simpleSchedule.time = time;
    };
    CalendarRepository.prototype.extractNewSchedule = function (task, view) {
        if (view === 'month') {
            var time = new Date();
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value;
            time.setSeconds(0);
            task._simpleSchedule.time = time;
        }
        else {
            task._simpleSchedule.time = this.getScheduleTime(task.schedule);
            if (view === 'week') {
                task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value;
            }
            else if (view === 'day') {
                task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.DAILY.value;
            }
        }
        task._simpleSchedule.daysOfMonth = this.getValues(task.schedule.day, CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(task.schedule.day_of_week, CalendarRepository.DAYS_OF_WEEK);
    };
    CalendarRepository.prototype.extractExistingDailySchedule = function (task) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.DAILY.value;
        task._simpleSchedule.daysOfMonth = this.getValues(new Date().getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(new Date().getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._simpleSchedule.time = this.getScheduleTime(task.schedule);
    };
    CalendarRepository.prototype.extractExistingWeeklySchedule = function (task) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value;
        task._simpleSchedule.daysOfMonth = this.getValues(new Date().getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(task.schedule.day_of_week, CalendarRepository.DAYS_OF_WEEK);
        task._simpleSchedule.time = this.getScheduleTime(task.schedule);
    };
    CalendarRepository.prototype.extractExistingMonthlySchedule = function (task) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value;
        task._simpleSchedule.daysOfMonth = this.getValues(task.schedule.day, CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(new Date().getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._simpleSchedule.time = this.getScheduleTime(task.schedule);
    };
    CalendarRepository.prototype.extractExistingCustomSchedule = function (task) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.CUSTOM.value;
        task._simpleSchedule.daysOfMonth = this.getValues(new Date().getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(new Date().getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._customSchedule.month = this.getValues(task.schedule.month, CalendarRepository.MONTHS);
        task._customSchedule.daysOfMonth = this.getValues(task.schedule.day, CalendarRepository.DAYS);
        task._customSchedule.hour = this.getValues(task.schedule.hour, CalendarRepository.HOURS);
        task._customSchedule.minute = this.getValues(task.schedule.minute, CalendarRepository.MINUTES);
    };
    CalendarRepository.prototype.isDaily = function (schedule) {
        return this.isEvery(schedule.day) &&
            this.isEvery(schedule.day_of_week) &&
            this.isEvery(schedule.month) &&
            this.isSingleValue(schedule.hour) &&
            this.isSingleValue(schedule.minute) &&
            this.isSingleValue(schedule.second);
    };
    CalendarRepository.prototype.isWeekly = function (schedule) {
        return this.isEvery(schedule.day) &&
            !this.isEvery(schedule.day_of_week) &&
            this.isEvery(schedule.month) &&
            this.isSingleValue(schedule.hour) &&
            this.isSingleValue(schedule.minute) &&
            this.isSingleValue(schedule.second);
    };
    CalendarRepository.prototype.isMonthly = function (schedule) {
        return !this.isEvery(schedule.day) &&
            this.isEvery(schedule.day_of_week) &&
            this.isEvery(schedule.month) &&
            this.isSingleValue(schedule.hour) &&
            this.isSingleValue(schedule.minute) &&
            this.isSingleValue(schedule.second);
    };
    CalendarRepository.prototype.isEvery = function (value) {
        return typeof value === 'undefined' || value === '*';
    };
    CalendarRepository.prototype.isSingleValue = function (value) {
        return typeof value === 'string' &&
            value.indexOf('/') === -1 &&
            value.indexOf(',') === -1;
    };
    CalendarRepository.prototype.getScheduleTime = function (schedule) {
        var scheduleTime = new Date(0);
        scheduleTime.setHours(schedule.hour);
        scheduleTime.setMinutes(schedule.minute);
        return scheduleTime;
    };
    CalendarRepository.prototype.getValues = function (string, options) {
        string = '' + string;
        var values = new Set();
        if (typeof string === 'string') {
            var entries = string.split(','), entry, matchingOptions;
            for (var i = 0, length = entries.length; i < length; i++) {
                entry = entries[i];
                if (entry.indexOf('/') === -1) {
                    entry = parseInt(entry);
                    matchingOptions = options.filter(function (x) { return x.index === entry; });
                    if (matchingOptions.length === 1) {
                        values.add(matchingOptions[0].value);
                    }
                }
                else {
                    var frequency = parseInt(entry.split('/')[1]);
                    options.filter(function (opt, idx) { return idx % frequency === 0; }).map(function (x) {
                        values.add(x.value);
                    });
                }
            }
        }
        else if (typeof string === 'number') {
            values.add(string);
        }
        return Array.from(values).sort();
    };
    CalendarRepository.prototype.buildScheduleFromTasksAndDay = function (tasks, day) {
        var task, key = day.year + '-' + day.month + '-' + day.date, tasksSchedule = this.tasksPerDay[key] ? this.tasksPerDay[key].tasks : [];
        tasksSchedule.clear();
        for (var i = 0, length = tasks.length; i < length; i++) {
            task = tasks[i];
            if (this.isDayMatchingSchedule(day, task.schedule)) {
                Array.prototype.push.apply(tasksSchedule, this.getTaskOccurrencesPerDay(task));
            }
        }
        tasksSchedule.sort(CalendarRepository.sortOccurrences);
        if (!this.tasksPerDay[key]) {
            this.tasksPerDay[key] = { day: day, tasks: tasksSchedule, concurrentEvents: 1 };
        }
        return tasksSchedule;
    };
    CalendarRepository.sortOccurrences = function (a, b) {
        var result = 0;
        if (a.task.enabled && !b.task.enabled) {
            result = -1;
        }
        else if (!a.task.enabled && b.task.enabled) {
            result = 1;
        }
        else if (a.hour < b.hour) {
            result = -1;
        }
        else if (a.hour > b.hour) {
            result = 1;
        }
        else if (a.hour != '*' && b.hour == '*') {
            result = -1;
        }
        else if (a.hour == '*' && b.hour != '*') {
            result = 1;
        }
        else if (a.minute < b.minute) {
            result = -1;
        }
        else if (a.minute > b.minute) {
            result = 1;
        }
        else if (a.minute != '*' && b.minute == '*') {
            result = -1;
        }
        else if (a.minute == '*' && b.minute != '*') {
            result = 1;
        }
        else if (a.second < b.second) {
            result = -1;
        }
        else if (a.second > b.second) {
            result = 1;
        }
        else if (a.second != '*' && b.second == '*') {
            result = -1;
        }
        else if (a.second == '*' && b.second != '*') {
            result = 1;
        }
        else if (a.task.name < b.task.name) {
            result = -1;
        }
        else if (a.task.name > b.task.name) {
            result = 1;
        }
        else if (a.task.id < b.task.id) {
            result = -1;
        }
        else if (a.task.id > b.task.id) {
            result = 1;
        }
        return result;
    };
    CalendarRepository.prototype.getTaskOccurrencesPerDay = function (task) {
        return this.iterateHours(task);
    };
    CalendarRepository.prototype.iterateHours = function (task, occurrences) {
        if (occurrences === void 0) { occurrences = []; }
        if (task.schedule.hour == '*') {
            this.iterateMinutes('*', task, occurrences);
        }
        else {
            for (var hour = 0; hour < 24; hour++) {
                if (this.isHourMatchingSchedule(hour, task.schedule)) {
                    this.iterateMinutes(hour, task, occurrences);
                }
            }
        }
        return occurrences;
    };
    CalendarRepository.prototype.iterateMinutes = function (hour, task, occurrences) {
        if (task.schedule.minute == '*') {
            this.iterateSeconds(hour, '*', task, occurrences);
        }
        else {
            for (var minute = 0; minute < 60; minute++) {
                if (this.isMinuteMatchingSchedule(minute, task.schedule)) {
                    this.iterateSeconds(hour, minute, task, occurrences);
                }
            }
        }
    };
    CalendarRepository.prototype.iterateSeconds = function (hour, minute, task, occurrences) {
        if (task.schedule.second == '*') {
            occurrences.push({
                hour: hour,
                minute: minute,
                second: '*',
                task: task
            });
        }
        else {
            for (var second = 0; second < 60; second++) {
                if (this.isSecondMatchingSchedule(second, task.schedule)) {
                    occurrences.push({
                        hour: hour,
                        minute: minute,
                        second: second,
                        task: task
                    });
                }
            }
        }
    };
    CalendarRepository.prototype.isDayMatchingSchedule = function (day, schedule) {
        return !!schedule &&
            CalendarRepository.isValueMatchingSchedule(day.year, schedule.year) &&
            CalendarRepository.isValueMatchingSchedule(day.month + 1, schedule.month) &&
            CalendarRepository.isValueMatchingSchedule(day.date, schedule.day) &&
            CalendarRepository.isValueMatchingSchedule(day.day, schedule.day_of_week);
    };
    CalendarRepository.prototype.isHourMatchingSchedule = function (hour, schedule) {
        return !!schedule &&
            CalendarRepository.isValueMatchingSchedule(hour, schedule.hour);
    };
    CalendarRepository.prototype.isMinuteMatchingSchedule = function (minute, schedule) {
        return !!schedule &&
            CalendarRepository.isValueMatchingSchedule(minute, schedule.minute);
    };
    CalendarRepository.prototype.isSecondMatchingSchedule = function (second, schedule) {
        return !!schedule &&
            CalendarRepository.isValueMatchingSchedule(second, schedule.second);
    };
    CalendarRepository.isValueMatchingSchedule = function (value, schedule) {
        if (typeof schedule !== "string") {
            schedule = _.toString(schedule);
        }
        var parts = schedule.split(','), part;
        for (var i = 0, length = parts.length; i < length; i++) {
            part = parts[i];
            if (part == '*' || part == value) {
                return true;
            }
            else if (part.indexOf('/') != -1) {
                var period = +part.split('/')[1];
                if (value % period === 0) {
                    return true;
                }
            }
        }
    };
    CalendarRepository.getIntegerSeries = function (start, end) {
        return _.times(end - start, function (x) { return ({ label: x, value: x, index: x }); });
    };
    CalendarRepository.prototype.refreshTasksSchedule = function () {
        var self = this;
        _.values(this.tasksPerDay).forEach(function (tasks) {
            self.getTasksScheduleOnDay(tasks.day);
        });
    };
    CalendarRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case 'CalendarTask':
                this.calendarTasks = this.dispatchModelEvents(this.calendarTasks, model_event_name_1.ModelEventName.CalendarTask, state);
                this.refreshTasksSchedule();
                break;
            default:
                break;
        }
    };
    CalendarRepository.prototype.handleEvent = function (name, data) { };
    return CalendarRepository;
}(abstract_repository_ng_1.AbstractRepository));
CalendarRepository.SCHEDULE_OPTIONS = {
    MONTHLY: {
        value: 'MONTHLY',
        label: 'every month',
        stringTemplate: "Monthly on {days} at {time}."
    },
    WEEKLY: {
        value: 'WEEKLY',
        label: 'every week',
        stringTemplate: "Weekly on {days} at {time}."
    },
    DAILY: {
        value: 'DAILY',
        label: 'every day',
        stringTemplate: "Daily at {time}."
    },
    CUSTOM: {
        value: 'CUSTOM',
        label: 'custom',
        stringTemplate: "Custom schedule, see dedicated panel."
    }
};
CalendarRepository.DAYS = CalendarRepository.getIntegerSeries(1, 31);
CalendarRepository.HOURS = CalendarRepository.getIntegerSeries(0, 23);
CalendarRepository.MINUTES = CalendarRepository.getIntegerSeries(0, 59);
CalendarRepository.MONTHS = [
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
];
CalendarRepository.DAYS_OF_WEEK = [
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
];
CalendarRepository.CALENDAR_TASK_CATEGORIES = [
    { name: "Scrub", value: "volume.scrub", checked: true },
    { name: "Replication", value: "replication.replicate_dataset", checked: true },
    { name: "Smart", value: "disk.parallel_test", checked: true },
    { name: "Update", value: "update.checkfetch", checked: true },
    { name: "Command", value: "calendar_task.command", checked: true },
    { name: "Snapshot", value: "volume.snapshot_dataset", checked: true },
    { name: "Rsync", value: "rsync.copy", checked: true }
];
exports.CalendarRepository = CalendarRepository;
