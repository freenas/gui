import {CalendarRepository} from '../../repository/calendar-repository';
import {TaskRepository} from '../../repository/task-repository';
import {SystemRepository} from '../../repository/system-repository';
import {AbstractSectionService} from './abstract-section-service-ng';
import {DiskRepository} from '../../repository/disk-repository';
import {VolumeRepository} from '../../repository/volume-repository';
import {AccountRepository} from '../../repository/account-repository';
import {ReplicationRepository} from '../../repository/replication-repository';
import {MiddlewareClient} from '../middleware-client';
import * as _ from 'lodash';

export class CalendarSectionService extends AbstractSectionService {
    private calendarRepository: CalendarRepository;
    private taskRepository: TaskRepository;
    private diskRepository: DiskRepository;
    private systemRepository: SystemRepository;
    private volumeRepository: VolumeRepository;
    private accountRepository: AccountRepository;
    private replicationRepository: ReplicationRepository;
    private middlewareClient: MiddlewareClient;

    public readonly SCHEDULE_OPTIONS = CalendarRepository.SCHEDULE_OPTIONS;
    public readonly DAYS = CalendarRepository.DAYS;
    public readonly HOURS = CalendarRepository.HOURS;
    public readonly MINUTES = CalendarRepository.MINUTES;
    public readonly MONTHS = CalendarRepository.MONTHS;
    public readonly DAYS_OF_WEEK = CalendarRepository.DAYS_OF_WEEK;
    public readonly CALENDAR_TASK_CATEGORIES = CalendarRepository.CALENDAR_TASK_CATEGORIES;

    protected init() {
        this.calendarRepository = CalendarRepository.getInstance();
        this.taskRepository = TaskRepository.getInstance();
        this.diskRepository = DiskRepository.getInstance();
        this.systemRepository = SystemRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
        this.accountRepository = AccountRepository.getInstance();
        this.replicationRepository = ReplicationRepository.getInstance();
        this.middlewareClient = MiddlewareClient.getInstance();
    }

    protected loadEntries(): Promise<Array<any>> {
        return this.calendarRepository.getNewCalendarInstance().then(function(calendar) {
            return [calendar];
        });
    }

    protected loadExtraEntries(): Promise<Array<any>> {
        return undefined;
    }

    protected loadSettings(): Promise<any> {
        return undefined;
    }

    protected loadOverview(): Promise<any> {
        return undefined;
    }

    public getGmtOffset() {
        return this.systemRepository.getGmtOffset();
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
        if (task.task === 'replication.sync') return this.runReplicationTask(task);
        this.taskRepository.submitTask(task.task, task.args);
    }

    public saveTask(task: any) {
        if (task.task === 'replication.sync') return this.saveReplicationTask(task);
        return this.calendarRepository.saveCalendarTask(task);
    }

    public updateScheduleOnTask(task: any) {
        this.calendarRepository.updateScheduleOnTask(task);
    }

    public listDisks() {
        return this.diskRepository.listDisks();
    }

    public listVolumes() {
        return this.volumeRepository.listVolumes();
    }

    public listUsers() {
        return this.accountRepository.listUsers();
    }

    public getNewReplicationInstance() {
        return Promise.all([
            this.replicationRepository.getNewReplicationInstance(),
            this.getHostUuid()
        ]).spread((replication, host) => {
            replication.master = host;
            replication.datasets = [{}];
            return replication;
        });
    }

    private getHostUuid(): Promise<string> {
        return this.hostPromise = this.hostPromise || this.middlewareClient.callRpcMethod('system.info.host_uuid');
    }

    private createReplication(task: any) {
        return this.getNewReplicationInstance()
            .then(replication => this.replicationRepository.saveReplication(
                _.merge(replication, {
                    name: task.name,
                    slave: _.get(task, 'args.1.peer'),
                    datasets: [{
                        master: task.args[0],
                        slave: _.get(task, 'args.1.remote_dataset')
                    }],
                    recursive: _.get(task, 'args.1.recursive'),
                    followdelete: _.get(task, 'args.1.followdelete'),
                    transport_options: _.get(task, 'args.2')
                })
            ));
    }

    private saveReplicationTask(task: any) {
        return this.createReplication(task)
            .then(() => this.calendarRepository.saveCalendarTask(
                _.set(task, 'args', [task.name])
            ));
    }

    private runReplicationTask(task: any) {
        return this.createReplication(task)
            .then(submittedTask => submittedTask.taskPromise)
            .then(replicationId => this.taskRepository.submitTask(task.task, [replicationId]));
    }
}
