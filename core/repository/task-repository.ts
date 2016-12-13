import {AbstractRepository} from "./abstract-repository-ng";
import {ModelEventName} from "../model-event-name";
import {Map} from "immutable";
import {TaskDao} from "../dao/task-dao";
import * as Promise from "bluebird";

export class TaskRepository extends AbstractRepository {
    private static instance: TaskRepository;

    private tasks: Map<string, Map<string, any>>;

    private constructor(private taskDao: TaskDao) {
        super([
            'Task'
        ]);
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

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Task':
                this.tasks = this.dispatchModelEvents(this.tasks, ModelEventName.Task, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }
}
