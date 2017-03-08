import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Replication} from '../model/Replication';

export class ReplicationDao extends AbstractDao<Replication> {

    public constructor() {
        super(Model.Replication);
    }

    public sync(replicationId) {
        return this.middlewareClient.submitTask('replication.sync', [replicationId]);
    }

    public getHostUuid() {
        return this.middlewareClient.callRpcMethod('system.info.host_uuid');
    }
}


