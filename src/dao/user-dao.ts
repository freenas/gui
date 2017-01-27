import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class UserDao extends AbstractDao {

    public constructor() {
        super(Model.User);
    }

    public getNextUid(): Promise<any> {
        return this.middlewareClient.callRpcMethod('user.next_uid');
    }

    public delete(object: any, args: any): Promise<any> {
        return AbstractDao.prototype.delete.call(this, object, [{
            delete_home_directory: !!args[0],
            delete_own_group: !!args[1]
        }]);
    }

}


