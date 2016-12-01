import { AbstractRepository } from './abstract-repository-ng';

import * as immutable from 'immutable';
import {VmwareDatasetDao} from "../dao/vmware-dataset-dao";

export class VmwareRepository extends AbstractRepository {
    private static instance: VmwareRepository;
    private datasets: immutable.Map<string, Map<string, any>>;

    private constructor(
        private vmwareDatasetDao: VmwareDatasetDao
    ) {
        super([
            'VmwareDataset'
        ]);
    }

    public static getInstance() {
        if (!VmwareRepository.instance) {
            VmwareRepository.instance = new VmwareRepository(
                VmwareDatasetDao.getInstance()
            );
        }
        return VmwareRepository.instance;
    }

    public listDatasets() {
        return this.vmwareDatasetDao.list();
    }

    public listDatastores(peer: Object, isFull: boolean) {

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


