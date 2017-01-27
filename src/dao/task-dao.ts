import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class TaskDao extends AbstractDao {

    public constructor() {
        super(Model.Task);
    }

    public submit(name: string, args = []): Promise<any> {
        return this.middlewareClient.submitTask(name, args);
    }
}

