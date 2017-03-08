import { AbstractRepository } from './abstract-repository';
import {ModelEventName} from '../model-event-name';
import {Map, Set} from 'immutable';
import {ReplicationDao} from '../dao/replication-dao';
import {CompressReplicationTransportOptionDao} from '../dao/compress-replication-transport-option-dao';
import {EncryptReplicationTransportOptionDao} from '../dao/encrypt-replication-transport-option-dao';
import {ThrottleReplicationTransportOptionDao} from '../dao/throttle-replication-transport-option-dao';
import {Model} from '../model';
import * as _ from 'lodash';
import {Replication} from '../model/Replication';

export class ReplicationRepository extends AbstractRepository<Replication> {
    private static instance: ReplicationRepository;
    private replications: Map<string, Map<string, any>>;
    private constructor(private replicationDao: ReplicationDao,
                        private compressReplicationTransportOptionDao: CompressReplicationTransportOptionDao,
                        private encryptReplicationTransportOptionDao: EncryptReplicationTransportOptionDao,
                        private throttleReplicationTransportOptionDao: ThrottleReplicationTransportOptionDao) {
        super([Model.Replication]);
    }

    public static getInstance() {
        if (!ReplicationRepository.instance) {
            ReplicationRepository.instance = new ReplicationRepository(
                new ReplicationDao(),
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

    public listReplicationsForVolume(volume: string) {
        return Promise.all([
            this.replicationDao.list(),
            this.getHostUuid()
        ]).spread((replications, host) => _.filter(replications, (replication: any) =>
            (replication.master === host && replication.datasets[0].master.startsWith(volume)) ||
                (replication.slave === host && replication.datasets[0].slave.startsWith(volume))
        ));
    }

    public getNewReplicationInstance() {
        return this.replicationDao.getNewInstance();
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

    public saveReplication(replication: any) {
        return this.replicationDao.save(replication);
    }

    public deleteReplication(replication:any) {
        return this.replicationDao.delete(replication);
    }

    public syncReplication(replicationId: string) {
        return this.replicationDao.sync(replicationId);
    }

    public getHostUuid() {
        return this.replicationDao.getHostUuid();
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

