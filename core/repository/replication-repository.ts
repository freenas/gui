import { AbstractRepository } from './abstract-repository-ng';
import {ModelEventName} from "../model-event-name";
import {Map, Set} from "immutable";
import {ReplicationOptionsDao} from "../dao/replication-options-dao";
import {ReplicationDao} from "../dao/replication-dao";

export class ReplicationRepository extends AbstractRepository {
    private static instance: ReplicationRepository;
    private replications: Map<string, Map<string, any>>;

    private constructor(private replicationDao: ReplicationDao,
                        private replicationOptionsDao: ReplicationOptionsDao) {
        super(['Replication']);
    }

    public static getInstance() {
        if (!ReplicationRepository.instance) {
            ReplicationRepository.instance = new ReplicationRepository(
                ReplicationDao.getInstance(),
                ReplicationOptionsDao.getInstance()
            );
        }
        return ReplicationRepository.instance;
    }

    public listReplications(): Promise<Array<Object>> {
        return this.replicationDao.list();
    }

    public getReplicationOptionsInstance() {
        return this.replicationOptionsDao.getNewInstance();
    }

    public replicateDataset(dataset: Object, replicationOptions: Object, transportOptions: Array<Object>) {
        return this.replicationDao.replicateDataset(dataset, replicationOptions, transportOptions);
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Replication':
                this.replications = this.dispatchModelEvents(this.replications, ModelEventName.Replication, state);
                break;
            default:
                break;
        }
    }

    private getReplicationId(replication: any) {
        return replication._replication ? replication._replication.id :
            replication.id ? replication.id : replication;
    }
}

