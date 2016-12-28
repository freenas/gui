"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var calendar_repository_1 = require("../../repository/calendar-repository");
var task_repository_1 = require("../../repository/task-repository");
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var CalendarSectionService = (function (_super) {
    __extends(CalendarSectionService, _super);
    function CalendarSectionService() {
        _super.apply(this, arguments);
        this.SCHEDULE_OPTIONS = calendar_repository_1.CalendarRepository.SCHEDULE_OPTIONS;
        this.DAYS = calendar_repository_1.CalendarRepository.DAYS;
        this.HOURS = calendar_repository_1.CalendarRepository.HOURS;
        this.MINUTES = calendar_repository_1.CalendarRepository.MINUTES;
        this.MONTHS = calendar_repository_1.CalendarRepository.MONTHS;
        this.DAYS_OF_WEEK = calendar_repository_1.CalendarRepository.DAYS_OF_WEEK;
        this.CALENDAR_TASK_CATEGORIES = calendar_repository_1.CalendarRepository.CALENDAR_TASK_CATEGORIES;
    }
    CalendarSectionService.prototype.init = function () {
        this.calendarRepository = calendar_repository_1.CalendarRepository.getInstance();
        this.taskRepository = task_repository_1.TaskRepository.getInstance();
    };
    CalendarSectionService.prototype.loadEntries = function () {
        return this.calendarRepository.getNewCalendarInstance().then(function (calendar) {
            return [calendar];
        });
    };
    CalendarSectionService.prototype.loadExtraEntries = function () {
        return undefined;
    };
    CalendarSectionService.prototype.loadSettings = function () {
        return undefined;
    };
    CalendarSectionService.prototype.loadOverview = function () {
        return undefined;
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
}(abstract_section_service_ng_1.AbstractSectionService));
exports.CalendarSectionService = CalendarSectionService;
