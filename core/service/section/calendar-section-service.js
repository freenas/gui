"use strict";
var calendar_repository_1 = require("../../repository/calendar-repository");
var task_repository_1 = require("../../repository/task-repository");
var CalendarSectionService = (function () {
    function CalendarSectionService() {
        this.SCHEDULE_OPTIONS = calendar_repository_1.CalendarRepository.SCHEDULE_OPTIONS;
        this.DAYS = calendar_repository_1.CalendarRepository.DAYS;
        this.HOURS = calendar_repository_1.CalendarRepository.HOURS;
        this.MINUTES = calendar_repository_1.CalendarRepository.MINUTES;
        this.MONTHS = calendar_repository_1.CalendarRepository.MONTHS;
        this.DAYS_OF_WEEK = calendar_repository_1.CalendarRepository.DAYS_OF_WEEK;
        this.CALENDAR_TASK_CATEGORIES = calendar_repository_1.CalendarRepository.CALENDAR_TASK_CATEGORIES;
        this.init();
    }
    CalendarSectionService.prototype.init = function () {
        this.calendarRepository = calendar_repository_1.CalendarRepository.getInstance();
        this.taskRepository = task_repository_1.TaskRepository.getInstance();
    };
    CalendarSectionService.prototype.getCalendarInstance = function () {
        return this.calendarRepository.getNewCalendarInstance();
    };
    CalendarSectionService.prototype.getTasksScheduleOnDay = function (day) {
        return this.calendarRepository.getTasksScheduleOnDay(day);
    };
    CalendarSectionService.prototype.initializeCalendarTask = function (task, view) {
        return this.calendarRepository.initializeTask(task, view);
    };
    CalendarSectionService.prototype.getScheduleStringForTask = function (task) {
        return this.calendarRepository.getScheduleStringForTask(task);
    };
    CalendarSectionService.prototype.runTask = function (task) {
        this.taskRepository.submitTask(task.task, task.args);
    };
    CalendarSectionService.prototype.updateScheduleOnTask = function (task) {
        this.calendarRepository.updateScheduleOnTask(task);
    };
    return CalendarSectionService;
}());
exports.CalendarSectionService = CalendarSectionService;
