import { AbstractRepository } from './abstract-repository-ng';

import * as immutable from 'immutable';
import {VmwareDatasetDao} from "../dao/vmware-dataset-dao";
import {VmwareDatastoreDao} from "../dao/vmware-datastore-dao";

export class VmwareRepository extends AbstractRepository {
    private static instance: VmwareRepository;
    private datasets: immutable.Map<string, Map<string, any>>;

    private constructor(
        private vmwareDatasetDao: VmwareDatasetDao,
        private vmwareDatastoreDao: VmwareDatastoreDao
    ) {
        super([
            'VmwareDataset',
            'VmwareSnapshot'
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

    public listDatasets() {
        return this.vmwareDatasetDao.list();
    }

    public getNewVmwareDataset() {
        return this.vmwareDatasetDao.getNewInstance();
    }

    public listDatastores(peer: any) {
        return this.vmwareDatastoreDao.list(peer);
    }

    protected handleStateChange(name: string, state: any) {
        let self = this;
        switch (name) {
            case 'VmwareDataset':
                this.eventDispatcherService.dispatch('vmwareDatasetsChange', state);
                state.forEach(function(vmwareDataset, id){
                    if (!self.datasets || !self.datasets.has(id)) {
                        self.eventDispatcherService.dispatch('vmwareDatasetAdd.' + id, vmwareDataset);
                    } else if (self.datasets.get(id) !== vmwareDataset) {
                        self.eventDispatcherService.dispatch('vmwareDatasetChange.' + id, vmwareDataset);
                    }
                });
                if (this.datasets) {
                    this.datasets.forEach(function(vmwareDataset, id){
                        if (!state.has(id) || state.get(id) !== vmwareDataset) {
                            self.eventDispatcherService.dispatch('vmwareDatasetRemove.' + id, vmwareDataset);
                        }
                    });
                }
                this.datasets = state;
                break;
            default:
                break;
        }
    }

    protected handleEvent() {}
}


