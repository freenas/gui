import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Task} from '../model/Task';

export class TaskDao extends AbstractDao<Task> {

    public constructor() {
        super(Model.Task);
    }

    public submit(name: string, args = []): Promise<any> {
        return this.middlewareClient.submitTask(name, args);
    }

    public abort(taskId: string): Promise<any> {
        return this.middlewareClient.callRpcMethod('task.abort', [taskId]);
    }
}

