import {TaskRepository} from "core/repository/task-repository";
export class TaskService {
    private static instance: TaskService;

    private constructor(private taskRepository: TaskRepository) {
    }

    public static getInstance() {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService(TaskRepository.instance);
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
