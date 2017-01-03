import { AbstractDao } from './abstract-dao';
import Promise = require("bluebird");

export class UserDao extends AbstractDao {

    public constructor() {
        super('User');
    }

    public getNextUid(): Promise<any> {
        return this.middlewareClient.callRpcMethod('user.next_uid');
    }

}


