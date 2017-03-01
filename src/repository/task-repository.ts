import {TaskDao} from '../dao/task-dao';
import * as _ from 'lodash';
import {Task} from '../model/Task';
import {AbstractModelRepository} from './abstract-model-repository';

export class TaskRepository extends AbstractModelRepository<Task> {
    private static instance: TaskRepository;

    private constructor(private taskDao: TaskDao) {
        super(taskDao);
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
        return this.list();
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
}
