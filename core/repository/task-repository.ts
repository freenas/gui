import {AbstractRepository} from "./abstract-repository-ng";
import {ModelEventName} from "../model-event-name";
import {Map} from "immutable";
import {TaskDao} from "../dao/task-dao";
import * as Promise from "bluebird";

export class TaskRepository extends AbstractRepository {
    private static instance: TaskRepository;

    private tasks: Map<string, Map<string, any>>;
    private taskPromises: Map<number, any>;

    private constructor(private taskDao: TaskDao) {
        super([
            'Task'
        ]);
        this.taskPromises = Map<number, any>();
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
        return this.taskDao.list();
    }

    public registerToTasks() {
        return this.taskDao.register();
    }

    public getTaskPromise(taskId: number): Promise<any> {
        return this.taskPromises.get(taskId);
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Task':
                let self = this;
                this.tasks = this.dispatchModelEvents(this.tasks, ModelEventName.Task, state);
                this.tasks.forEach(function(task) {
                    let taskId = task.get('id');
                    if (self.taskPromises.has(taskId)) {
                        let deferred = self.taskPromises.get(taskId);
                        if (task.state === 'FINISHED') {
                            deferred.resolve(task);
                        } else if (task.state == 'FAILED') {
                            deferred.reject(task);
                        }
                    } else {
                        self.taskPromises.set(taskId, self.defer());
                    }
                });
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }

    private defer() {
        let resolve, reject,
            promise = new Promise(function() {
            resolve = arguments[0];
            reject = arguments[1];
        });
        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        };
    }
}
