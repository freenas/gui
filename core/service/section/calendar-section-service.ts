import {CalendarRepository} from "../../repository/calendar-repository";
import {TaskRepository} from "../../repository/task-repository";

export class CalendarSectionService {
    private calendarRepository: CalendarRepository;
    private taskRepository: TaskRepository;

    public readonly SCHEDULE_OPTIONS = CalendarRepository.SCHEDULE_OPTIONS;
    public readonly DAYS = CalendarRepository.DAYS;
    public readonly HOURS = CalendarRepository.HOURS;
    public readonly MINUTES = CalendarRepository.MINUTES;
    public readonly MONTHS = CalendarRepository.MONTHS;
    public readonly DAYS_OF_WEEK = CalendarRepository.DAYS_OF_WEEK;
    public readonly CALENDAR_TASK_CATEGORIES = CalendarRepository.CALENDAR_TASK_CATEGORIES;

    public constructor() {
        this.init();
    }

    protected init() {
        this.calendarRepository = CalendarRepository.getInstance();
        this.taskRepository = TaskRepository.getInstance();
    }

    public getCalendarInstance() {
        return this.calendarRepository.getNewCalendarInstance();
    }

    public getTasksScheduleOnDay(day: any) {
        return this.calendarRepository.getTasksScheduleOnDay(day);
    }

    public initializeCalendarTask(task: any, view: any) {
        return this.calendarRepository.initializeTask(task, view);
    }

    public getScheduleStringForTask(task: any) {
        return this.calendarRepository.getScheduleStringForTask(task);
    }

    public runTask(task: any) {
        this.taskRepository.submitTask(task.task, task.args);
    }

    public updateScheduleOnTask(task: any) {
        this.calendarRepository.updateScheduleOnTask(task);
    }
}
