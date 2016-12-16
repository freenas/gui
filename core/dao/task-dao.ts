import { AbstractDao } from './abstract-dao-ng';
import * as Promise from "bluebird";

export class TaskDao extends AbstractDao {

    public constructor() {
        super('Task');
    }

    public submit(name: string, args = []): Promise<any> {
        return this.middlewareClient.submitTask(name, args);
    }
}

