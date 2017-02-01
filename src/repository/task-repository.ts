import {AbstractRepository} from './abstract-repository';
import {ModelEventName} from '../model-event-name';
import {Map} from 'immutable';
import {TaskDao} from '../dao/task-dao';
import {Model} from '../model';
import * as _ from 'lodash';

export class TaskRepository extends AbstractRepository {
    private static instance: TaskRepository;

    private tasks: Map<string, Map<string, any>>;

    private constructor(private taskDao: TaskDao) {
        super([Model.Task]);
    }

    public static getInstance() {
        if (!TaskRepository.instance) {
            TaskRepository.instance = new TaskRepository(
                new TaskDao()
            );
        }
        return TaskRepository.instance;
    }

    public listTasks(): Promise<Array<Object>> {
        return this.tasks ? Promise.resolve(this.tasks.valueSeq().toJS()) : this.taskDao.list();
    }

    public findTasks(criteria: any): Promise<Array<any>> {
        return this.taskDao.find(criteria);
    }

    public getTask(taskId: number): any {
        return this.listTasks().then((tasks) => _.find(tasks, {id: taskId}));
    }

    public registerToTasks() {
        return this.taskDao.register();
    }

    public submitTask(name: string, args?: Array<any>): Promise<any> {
        return this.taskDao.submit(name, args);
    }

    protected handleStateChange(name: string, state: any) {
        this.tasks = this.dispatchModelEvents(this.tasks, ModelEventName.Task, state);
    }

    protected handleEvent(name: string, data: any) {
    }
}
