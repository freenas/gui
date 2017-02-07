import {AbstractRepository} from './abstract-repository';
import {CalendarDao} from '../dao/calendar-dao';
import {CalendarTaskDao} from '../dao/calendar-task-dao';
import * as _ from 'lodash';
import {ModelEventName} from '../model-event-name';
import {Map} from 'immutable';
import {Model} from '../model';
import {CalendarTask} from '../model/CalendarTask';

export class CalendarRepository extends AbstractRepository {
    private static instance: CalendarRepository;

    private calendarTasks: Map<string, Map<string, any>>;
    private listTasksPromise: Promise<any>;
    private tasksPerDay: any;

    public static readonly SCHEDULE_OPTIONS = {
        MONTHLY:    {
            value: 'MONTHLY',
            label: 'every month',
            stringTemplate: 'Monthly on {days} at {time}.'
        },
        WEEKLY:     {
            value: 'WEEKLY',
            label: 'every week',
            stringTemplate: 'Weekly on {days} at {time}.'
        },
        DAILY:      {
            value: 'DAILY',
            label: 'every day',
            stringTemplate: 'Daily at {time}.'
        },
        CUSTOM:     {
            value: 'CUSTOM',
            label: 'custom',
            stringTemplate: 'Custom schedule, see dedicated panel.'
        }
    };
    public static readonly DAYS = CalendarRepository.getIntegerSeries(1,31);
    public static readonly HOURS = CalendarRepository.getIntegerSeries(0, 23);
    public static readonly MINUTES = CalendarRepository.getIntegerSeries(0, 59);
    public static readonly MONTHS = [
        {
            value: {
                label: 'January',
                index: 0
            },
            label: 'Jan',
            index: 0
        },
        {
            value: {
                label: 'February',
                index: 1
            },
            label: 'Feb',
            index: 1
        },
        {
            value: {
                label: 'March',
                index: 2
            },
            label: 'Mar',
            index: 2
        },
        {
            value: {
                label: 'April',
                index: 3
            },
            label: 'Apr',
            index: 3
        },
        {
            value: {
                label: 'May',
                index: 4
            },
            label: 'May',
            index: 4
        },
        {
            value: {
                label: 'June',
                index: 5
            },
            label: 'Jun',
            index: 5
        },
        {
            value: {
                label: 'July',
                index: 6
            },
            label: 'Jul',
            index: 6
        },
        {
            value: {
                label: 'August',
                index: 7
            },
            label: 'Aug',
            index: 7
        },
        {
            value: {
                label: 'September',
                index: 8
            },
            label: 'Sep',
            index: 8
        },
        {
            value: {
                label: 'October',
                index: 9
            },
            label: 'Oct',
            index: 9
        },
        {
            value: {
                label: 'November',
                index: 10
            },
            label: 'Nov',
            index: 10
        },
        {
            value: {
                label: 'December',
                index: 11
            },
            label: 'Dec',
            index: 11
        }
    ];
    public static readonly DAYS_OF_WEEK = [
        {
            value: {
                label: 'Sunday',
                index: 0
            },
            label: 'S',
            index: 0
        },
        {
            value: {
                label: 'Monday',
                index: 1
            },
            label: 'M',
            index: 1
        },
        {
            value: {
                label: 'Tuesday',
                index: 2
            },
            label: 'T',
            index: 2
        },
        {
            value: {
                label: 'Wednesday',
                index: 3
            },
            label: 'W',
            index: 3
        },
        {
            value: {
                label: 'Thursday',
                index: 4
            },
            label: 'Th',
            index: 4
        },
        {
            value: {
                label: 'Friday',
                index: 5
            },
            label: 'F',
            index: 5
        },
        {
            value: {
                label: 'Saturday',
                index: 6
            },
            label: 'S',
            index: 6
        }
    ];

    public static readonly CALENDAR_TASK_CATEGORIES = [
        { name: 'Scrub', value: 'volume.scrub', checked: true },
        { name: 'Replication', value: 'replication.replicate_dataset', checked: true },
        { name: 'Smart', value: 'disk.parallel_test', checked: true },
        { name: 'Update', value: 'update.checkfetch', checked: true },
        { name: 'Command', value: 'calendar_task.command', checked: true },
        { name: 'Snapshot', value: 'volume.snapshot_dataset', checked: true },
        { name: 'Rsync', value: 'rsync.copy', checked: true }
    ];

    public constructor(private calendarDao: CalendarDao,
                       private calendarTaskDao: CalendarTaskDao
    ) {
        super([
            Model.Calendar,
            Model.CalendarTask
        ]);
        this.tasksPerDay = {};
    }

    public static getInstance() {
        if (!CalendarRepository.instance) {
            CalendarRepository.instance = new CalendarRepository(
                new CalendarDao(),
                new CalendarTaskDao()
            );
        }
        return CalendarRepository.instance;
    }

    public getNewCalendarInstance() {
        return this.calendarDao.getNewInstance();
    }

    public getTasksScheduleOnDay(day: any) {
        let self = this;
        return this.listTasks().then(function(tasks) {
            return self.buildScheduleFromTasksAndDay(tasks, day);
        }).then(function(schedule) {
            return self.addConcurrentTasksToSchedule(schedule);
        });
    }

    public listTasks() {
        return this.calendarTasks ? Promise.resolve(this.calendarTasks.valueSeq().toJS()) : this.calendarTaskDao.list();
    }

    public addConcurrentTasksToSchedule(schedule: any) {
        let task, nextTask,
            timeInMinutes, nextTimeInMinutes,
            j, tasksLength;
        for (let i = 0, length = schedule.length; i < length; i++) {
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
        for (let i = 0, length = schedule.length; i < length; i++) {
            task = schedule[i];
            tasksLength = task._concurrentTasks.length;
            task.concurrentEvents = tasksLength;
            for (j = 0; j < tasksLength; j++) {
                if (task._concurrentTasks[j] === task) {
                    task.concurrentIndex = j;
                    break;
                }
            }
            delete task._concurrentTasks;
        }
        return schedule;
    }

    public initializeTask(task: any, view: any) {
        this.extractSchedule(task, view);
        if (!Array.isArray(task.args)) {
            task.args = [];
        }
        task.args.__type = task.task;
    }

    public getScheduleStringForTask(task: any) {
        if (task._simpleSchedule && task._simpleSchedule.type) {
            let type = task._simpleSchedule.type;
            if (type === CalendarRepository.SCHEDULE_OPTIONS.CUSTOM.value) {
                return CalendarRepository.SCHEDULE_OPTIONS.CUSTOM.stringTemplate;
            } else if (task._simpleSchedule.time) {
                let time = task._simpleSchedule.time.toLocaleTimeString(),
                    days = type === CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value ?
                        task._simpleSchedule.daysOfWeek.map(function(x) { return x.label; }) :
                        type === CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value ?
                            task._simpleSchedule.daysOfMonth.sort(function(a, b) { return parseInt(a) - parseInt(b); }) :
                            [];

                return CalendarRepository.SCHEDULE_OPTIONS[task._simpleSchedule.type].stringTemplate
                    .replace('{days}', days.join(', '))
                    .replace('{time}', time);
            }
        }
        return '';
    }

    public updateScheduleOnTask(task: any) {
        let schedule;
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
                task.schedule.day_of_week = schedule.daysOfWeek.map(function(x) { return x.index; }).join(',');
            } else if (schedule.type === CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value) {
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


    private extractSchedule(task: any, view: any) {
        if (!task._simpleSchedule) {
            task._simpleSchedule = {};
            if (task._isNew) {
                if (task.schedule) {
                    this.extractNewSchedule(task, view);
                } else {
                    this.setDefaultSchedule(task, view);
                }
            } else if (task.schedule) {
                this.extractExistingSchedule(task);
            }
        }
    }

    private extractExistingSchedule(task: any) {
        if (this.isDaily(task.schedule)) {
            this.extractExistingDailySchedule(task);
        } else if (this.isWeekly(task.schedule)) {
            this.extractExistingWeeklySchedule(task);
        } else if (this.isMonthly(task.schedule)) {
            this.extractExistingMonthlySchedule(task);
        } else {
            this.extractExistingCustomSchedule(task);
        }
    }

    private setDefaultSchedule(task: any, view: any) {
        if (view === 'month') {
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value;
        } else if (view === 'week') {
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value;
        } else if (view === 'day') {
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.DAILY.value;
        }
        let now = new Date();
        task._simpleSchedule.daysOfMonth = this.getValues(now.getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(now.getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._customSchedule.daysOfMonth = this.getValues(now.getDate(), CalendarRepository.DAYS);
        task._customSchedule.month = this.getValues(now.getMonth(), CalendarRepository.MONTHS);
        task._customSchedule.hour = this.getValues(now.getHours(), CalendarRepository.HOURS);
        task._customSchedule.minute = this.getValues(now.getMinutes(), CalendarRepository.MINUTES);
        let time = new Date();
        time.setSeconds(0);
        task._simpleSchedule.time = time;
    }

    private extractNewSchedule(task: any, view: any) {
        if (view === 'month') {
            let time = new Date();
            task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value;
            time.setSeconds(0);
            task._simpleSchedule.time = time;
        } else {
            task._simpleSchedule.time = this.getScheduleTime(task.schedule);
            if (view === 'week') {
                task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value;
            } else if (view === 'day') {
                task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.DAILY.value;
            }
        }
        task._simpleSchedule.daysOfMonth = this.getValues(task.schedule.day, CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(task.schedule.day_of_week, CalendarRepository.DAYS_OF_WEEK);
    }

    private extractExistingDailySchedule(task: any) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.DAILY.value;
        task._simpleSchedule.daysOfMonth = this.getValues(new Date().getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(new Date().getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._simpleSchedule.time = this.getScheduleTime(task.schedule);
    }

    private extractExistingWeeklySchedule(task: any) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.WEEKLY.value;
        task._simpleSchedule.daysOfMonth = this.getValues(new Date().getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(task.schedule.day_of_week, CalendarRepository.DAYS_OF_WEEK);
        task._simpleSchedule.time = this.getScheduleTime(task.schedule);
    }

    private extractExistingMonthlySchedule(task: any) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.MONTHLY.value;
        task._simpleSchedule.daysOfMonth = this.getValues(task.schedule.day, CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(new Date().getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._simpleSchedule.time = this.getScheduleTime(task.schedule);
    }

    private extractExistingCustomSchedule(task: any) {
        task._simpleSchedule.type = CalendarRepository.SCHEDULE_OPTIONS.CUSTOM.value;
        task._simpleSchedule.daysOfMonth = this.getValues(new Date().getDate(), CalendarRepository.DAYS);
        task._simpleSchedule.daysOfWeek = this.getValues(new Date().getDay(), CalendarRepository.DAYS_OF_WEEK);
        task._customSchedule.month = this.getValues(task.schedule.month, CalendarRepository.MONTHS);
        task._customSchedule.daysOfMonth = this.getValues(task.schedule.day, CalendarRepository.DAYS);
        task._customSchedule.hour = this.getValues(task.schedule.hour, CalendarRepository.HOURS);
        task._customSchedule.minute = this.getValues(task.schedule.minute, CalendarRepository.MINUTES);
    }

    private isDaily(schedule: any) {
        return  this.isEvery(schedule.day) &&
            this.isEvery(schedule.day_of_week) &&
            this.isEvery(schedule.month) &&
            this.isSingleValue(schedule.hour) &&
            this.isSingleValue(schedule.minute) &&
            this.isSingleValue(schedule.second);
    }

    private isWeekly(schedule: any) {
        return  this.isEvery(schedule.day) &&
            !this.isEvery(schedule.day_of_week) &&
            this.isEvery(schedule.month) &&
            this.isSingleValue(schedule.hour) &&
            this.isSingleValue(schedule.minute) &&
            this.isSingleValue(schedule.second);
    }

    private isMonthly(schedule: any) {
        return  !this.isEvery(schedule.day) &&
            this.isEvery(schedule.day_of_week) &&
            this.isEvery(schedule.month) &&
            this.isSingleValue(schedule.hour) &&
            this.isSingleValue(schedule.minute) &&
            this.isSingleValue(schedule.second);
    }

    private isEvery(value: any) {
        return typeof value === 'undefined' || value === '*';
    }

    private isSingleValue(value: any) {
        return  typeof value === 'string' &&
            value.indexOf('/') === -1 &&
            value.indexOf(',') === -1;
    }

    private getScheduleTime(schedule: any) {
        let scheduleTime = new Date(0);
        scheduleTime.setHours(schedule.hour);
        scheduleTime.setMinutes(schedule.minute);
        return scheduleTime;
    }

    private getValues(string: any, options) {
        string = ''+string;
        let values = new Set();
        if (typeof string === 'string') {
            let entries = string.split(','),
                entry, matchingOptions;
            for (let i = 0, length = entries.length; i < length; i++) {
                entry = entries[i];
                if (entry.indexOf('/') === -1) {
                    entry = parseInt(entry);
                    matchingOptions = options.filter(function(x) { return x.index === entry; });
                    if (matchingOptions.length === 1) {
                        values.add(matchingOptions[0].value);
                    }
                } else {
                    let frequency = parseInt(entry.split('/')[1]);
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

    private buildScheduleFromTasksAndDay(tasks: Array<any>, day: any) {
        let task,
            key = day.year+'-'+day.month+'-'+day.date,
            tasksSchedule = this.tasksPerDay[key] ? this.tasksPerDay[key].tasks : [];
        tasksSchedule.clear();
        for (let i = 0, length = tasks.length; i < length; i++) {
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
    }

    private static sortOccurrences(a: any, b: any) {
        let result = 0;
        if (a.task.enabled && !b.task.enabled) {
            result = -1;
        } else if (!a.task.enabled && b.task.enabled) {
            result = 1;
        } else if (a.hour < b.hour) {
            result = -1;
        } else if (a.hour > b.hour) {
            result = 1;
        } else if (a.hour !== '*' && b.hour === '*') {
            result = -1;
        } else if (a.hour === '*' && b.hour !== '*') {
            result = 1;
        } else if (a.minute < b.minute) {
            result = -1;
        } else if (a.minute > b.minute) {
            result = 1;
        } else if (a.minute !== '*' && b.minute === '*') {
            result = -1;
        } else if (a.minute === '*' && b.minute !== '*') {
            result = 1;
        } else if (a.second < b.second) {
            result = -1;
        } else if (a.second > b.second) {
            result = 1;
        } else if (a.second !== '*' && b.second === '*') {
            result = -1;
        } else if (a.second === '*' && b.second !== '*') {
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

    private getTaskOccurrencesPerDay(task: any) {
        return this.iterateHours(task);
    }

    private iterateHours(task: any, occurrences = []) {
        if (task.schedule.hour === '*') {
            this.iterateMinutes('*', task, occurrences);
        } else {
            for (let hour = 0; hour < 24; hour++) {
                if (this.isHourMatchingSchedule(hour, task.schedule)) {
                    this.iterateMinutes(hour, task, occurrences);
                }
            }
        }
        return occurrences;
    }

    private iterateMinutes(hour: any, task: any, occurrences: Array<any>) {
        if (task.schedule.minute === '*') {
            this.iterateSeconds(hour, '*', task, occurrences);
        } else {
            for (let minute = 0; minute < 60; minute++) {
                if (this.isMinuteMatchingSchedule(minute, task.schedule)) {
                    this.iterateSeconds(hour, minute, task, occurrences);
                }
            }
        }
    }

    private iterateSeconds(hour, minute, task, occurrences: Array<any>) {
        if (task.schedule.second === '*') {
            occurrences.push({
                hour: hour,
                minute: minute,
                second: '*',
                task: task
            });
        } else {
            for (let second = 0; second < 60; second++) {
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
    }

    private isDayMatchingSchedule(day: any, schedule: any) {
        return  !!schedule &&
            CalendarRepository.isValueMatchingSchedule(day.year, schedule.year) &&
            CalendarRepository.isValueMatchingSchedule(day.month+1, schedule.month) &&
            CalendarRepository.isValueMatchingSchedule(day.date, schedule.day) &&
            CalendarRepository.isValueMatchingSchedule(day.day, schedule.day_of_week);
    }

    private isHourMatchingSchedule(hour: any, schedule: any) {
        return  !!schedule &&
            CalendarRepository.isValueMatchingSchedule(hour, schedule.hour);
    }

    private isMinuteMatchingSchedule(minute: any, schedule: any) {
        return  !!schedule &&
            CalendarRepository.isValueMatchingSchedule(minute, schedule.minute);
    }

    private isSecondMatchingSchedule(second: any, schedule: any) {
        return  !!schedule &&
            CalendarRepository.isValueMatchingSchedule(second, schedule.second);
    }

    private static isValueMatchingSchedule(value: any, schedule: any) {
        if (typeof schedule !== 'string') {
            schedule = _.toString(schedule);
        }
        let parts = schedule.split(','),
            part;
        for (let i = 0, length = parts.length; i < length; i++) {
            part = parts[i];
            if (part === '*' || part === _.toString(value)) {
                return true;
            } else if (part.indexOf('/') !== -1) {
                let period = +part.split('/')[1];
                if (value % period === 0) {
                    return true;
                }
            }
        }
    }

    private static getIntegerSeries(start, end) {
        return _.times(end - start, (x) => ({ label: x, value: x, index: x }));
    }

    private refreshTasksSchedule() {
        let self = this;
        _.values(this.tasksPerDay).forEach(function(tasks) {
            self.getTasksScheduleOnDay((tasks as any).day);
        });
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case Model.CalendarTask:
                this.calendarTasks = this.dispatchModelEvents(this.calendarTasks, ModelEventName.CalendarTask, state);
                this.refreshTasksSchedule();
                break;
            default:
                break;
        }
    }
    protected handleEvent(name: string, data: any) {}
}
