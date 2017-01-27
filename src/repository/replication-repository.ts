import { AbstractRepository } from './abstract-repository-ng';
import {ModelEventName} from "../model-event-name";
import {Map, Set} from "immutable";
import {ReplicationOptionsDao} from "../dao/replication-options-dao";
import {ReplicationDao} from "../dao/replication-dao";
import {CompressReplicationTransportOptionDao} from "../dao/compress-replication-transport-option-dao";
import {EncryptReplicationTransportOptionDao} from "../dao/encrypt-replication-transport-option-dao";
import {ThrottleReplicationTransportOptionDao} from "../dao/throttle-replication-transport-option-dao";
import {Model} from "../model";

export class ReplicationRepository extends AbstractRepository {
    private static instance: ReplicationRepository;
    private replications: Map<string, Map<string, any>>;
    private constructor(private replicationDao: ReplicationDao,
                        private replicationOptionsDao: ReplicationOptionsDao,
                        private compressReplicationTransportOptionDao: CompressReplicationTransportOptionDao,
                        private encryptReplicationTransportOptionDao: EncryptReplicationTransportOptionDao,
                        private throttleReplicationTransportOptionDao: ThrottleReplicationTransportOptionDao) {
        super([Model.Replication]);
    }

    public static getInstance() {
        if (!ReplicationRepository.instance) {
            ReplicationRepository.instance = new ReplicationRepository(
                new ReplicationDao(),
                new ReplicationOptionsDao(),
                new CompressReplicationTransportOptionDao(),
                new EncryptReplicationTransportOptionDao(),
                new ThrottleReplicationTransportOptionDao()
            );
        }
        return ReplicationRepository.instance;
    }

    public listReplications(): Promise<Array<Object>> {
        return this.replicationDao.list();
    }

    public getNewReplicationInstance() {
        return this.replicationDao.getNewInstance();
    }

    public getReplicationOptionsInstance() {
        return this.replicationOptionsDao.getNewInstance();
    }

    public getNewReplicationTransportOptionInstance(type) {
        if (type === Model.CompressReplicationTransportOption) {
            return this.compressReplicationTransportOptionDao.getNewInstance();
        } else if (type === Model.EncryptReplicationTransportOption) {
            return this.encryptReplicationTransportOptionDao.getNewInstance();
        } else if (type === Model.ThrottleReplicationTransportOption) {
            return this.throttleReplicationTransportOptionDao.getNewInstance();
        }
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

    protected handleEvent(name: string, data: any) {
    }
}

