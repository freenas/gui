import { AbstractRepository } from './abstract-repository';
import {VmwareDatasetDao} from '../dao/vmware-dataset-dao';
import {VmwareDatastoreDao} from '../dao/vmware-datastore-dao';
import {Model} from '../model';
import {Map} from 'immutable';
import {ModelEventName} from '../model-event-name';

export class VmwareRepository extends AbstractRepository {
    private static instance: VmwareRepository;
    private datasets: Map<string, Map<string, any>>;
    private datastores: Map<string, Map<string, any>>;

    private constructor(
        private vmwareDatasetDao: VmwareDatasetDao,
        private vmwareDatastoreDao: VmwareDatastoreDao
    ) {
        super([
            Model.VmwareDataset,
            Model.VmwareDatastore
        ]);
    }

    public static getInstance() {
        if (!VmwareRepository.instance) {
            VmwareRepository.instance = new VmwareRepository(
                new VmwareDatasetDao(),
                new VmwareDatastoreDao()
            );
        }
        return VmwareRepository.instance;
    }

    public listDatasets(): Promise<Array<any>> {
        return this.datasets ? Promise.resolve(this.datasets.valueSeq().toJS()) : this.vmwareDatasetDao.list();
    }

    public getNewVmwareDataset() {
        return this.vmwareDatasetDao.getNewInstance();
    }

    public listDatastores(peer: any) {
        return this.datastores ? Promise.resolve(this.datastores.valueSeq().toJS()) : this.vmwareDatastoreDao.listDatastoresOnPeer(peer);
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case Model.VmwareDataset:
                this.datasets = this.dispatchModelEvents(this.datasets, ModelEventName.VmwareDataset, state);
                break;
            case Model.VmwareDatastore:
                this.datastores = this.dispatchModelEvents(this.datastores, ModelEventName.VmwareDatastore, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent() {}
}


