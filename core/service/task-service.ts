import {TaskRepository} from "../repository/task-repository";
import Promise = require("bluebird");

export class TaskService {
    private static instance: TaskService;

    private constructor(private taskRepository: TaskRepository) {
    }

    public static getInstance() {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService(TaskRepository.getInstance());
        }
        return TaskService.instance;
    }

    public loadEntries(): Promise<Array<Object> > {
        return this.taskRepository.listTasks();
    }

    public findTasks(filter: Object): Promise<Array <Object>> {
        return this.taskRepository.findTasks(filter);
    }
}
