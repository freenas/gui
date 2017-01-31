import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import {Replication} from '../model/Replication';

export class ReplicationDao extends AbstractDao<Replication> {

    public constructor() {
        super(Model.Replication);
    }

    public replicateDataset(dataset: Object, replicationOptions: Object, transportOptions: Array<Object>) {
        return this.middlewareClient.submitTask('replication.replicate_dataset', [dataset, replicationOptions, transportOptions]);
    }
}


