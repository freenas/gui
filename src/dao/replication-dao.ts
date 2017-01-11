import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class ReplicationDao extends AbstractDao {

    public constructor() {
        super(Model.Replication);
    }

    public replicateDataset(dataset: Object, replicationOptions: Object, transportOptions: Array<Object>) {
        return this.middlewareClient.submitTask('replication.replicate_dataset', [dataset, replicationOptions, transportOptions]);
    }
}


