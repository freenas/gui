import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Group} from '../model/Group';

export class GroupDao extends AbstractDao<Group> {

    public constructor() {
        super(Model.Group);
    }

    getNextGid() {
        return this.middlewareClient.callRpcMethod('group.next_gid');
    }
}

