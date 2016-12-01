import { AbstractRepository } from './abstract-repository-ng';
import { VolumeDao } from 'core/dao/volume-dao';
import { VolumeSnapshotDao } from 'core/dao/volume-snapshot-dao';
import { VolumeDatasetDao } from 'core/dao/volume-dataset-dao';
import { VolumeImporterDao } from 'core/dao/volume-importer-dao';
import { EncryptedVolumeActionsDao } from 'core/dao/encrypted-volume-actions-dao';

import * as immutable from 'immutable';
import {VolumeVdevRecommendationsDao} from "../dao/volume-vdev-recommendations-dao";

export class VolumeRepository extends AbstractRepository {
    private static instance: VolumeRepository;
    private volumes: immutable.Map<string, Map<string, any>>;
    private volumeSnapshots: immutable.Map<string, Map<string, any>>;
    private volumeDatasets: immutable.Map<string, Map<string, any>>;

    private constructor(
        private volumeDao: VolumeDao,
        private volumeSnapshotDao: VolumeSnapshotDao,
        private volumeDatasetDao: VolumeDatasetDao,
        private volumeImporterDao: VolumeImporterDao,
        private encryptedVolumeActionsDao: EncryptedVolumeActionsDao,
        private volumeVdevRecommendationsDao: VolumeVdevRecommendationsDao
    ) {
        super([
            'Volume',
            'VolumeDataset',
            'VolumeSnapshot'
        ]);
    }

    public static getInstance() {
        if (!VolumeRepository.instance) {
            VolumeRepository.instance = new VolumeRepository(
                VolumeDao.getInstance(),
                VolumeSnapshotDao.getInstance(),
                VolumeDatasetDao.getInstance(),
                VolumeImporterDao.getInstance(),
                EncryptedVolumeActionsDao.getInstance(),
                VolumeVdevRecommendationsDao.getInstance()
            );
        }
        return VolumeRepository.instance;
    }

    public listVolumes(): Promise<Array<Object>> {
        return this.volumeDao.list();
    }

    public listDatasets(): Promise<Array<Object>> {
        return this.volumeDatasetDao.list();
    }

    public listSnapshots(): Promise<Array<Object>> {
        return this.volumeSnapshotDao.list();
    }

    public getVolumeImporter(): Promise<Object> {
        return this.volumeImporterDao.getNewInstance().then(function(volumeImporter) {
            volumeImporter._isNew = false;
            return volumeImporter;
        });
    }

    public getEncryptedVolumeActionsInstance(): Promise<Object> {
        return this.encryptedVolumeActionsDao.getNewInstance();
    }

    public getDisksAllocations(diskIds: Array<string>): Promise<Array<Object>> {
        return this.volumeDao.getDisksAllocation(diskIds);
    }

    public getAvailableDisks(): Promise<string> {
        return this.volumeDao.getAvailableDisks();
    }

    public getVdevRecommendations(): Promise<Object> {
        return this.volumeVdevRecommendationsDao.get();
    }

    public createVolume(volume: Object): Promise<void> {
        return this.volumeDao.save(volume);
    }

    protected handleStateChange(name: string, state: any) {
        let self = this;
        switch (name) {
            case 'Volume':
                this.eventDispatcherService.dispatch('volumesChange', state);
                state.forEach(function(volume, id){
                    if (!self.volumes || !self.volumes.has(id)) {
                        self.eventDispatcherService.dispatch('volumeAdd.' + id, volume);
                    } else if (self.volumes.get(id) !== volume) {
                        self.eventDispatcherService.dispatch('volumeChange.' + id, volume);
                    }
                });
                if (this.volumes) {
                    this.volumes.forEach(function(volume, id){
                        if (!state.has(id) || state.get(id) !== volume) {
                            self.eventDispatcherService.dispatch('volumeRemove.' + id, volume);
                        }
                    });
                }
                this.volumes = state;
                break;
            case 'VolumeSnapshot':
                this.eventDispatcherService.dispatch('volumeSnapshotsChange', state);
                state.forEach(function(volumeSnapshot, id){
                    if (!self.volumeSnapshots || !self.volumeSnapshots.has(id)) {
                        self.eventDispatcherService.dispatch('volumeSnapshotAdd.' + id, volumeSnapshot);
                    } else if (self.volumeSnapshots.get(id) !== volumeSnapshot) {
                        self.eventDispatcherService.dispatch('volumeSnapshotChange.' + id, volumeSnapshot);
                    }
                });
                if (this.volumeSnapshots) {
                    this.volumeSnapshots.forEach(function(volumeSnapshot, id){
                        if (!state.has(id) || state.get(id) !== volumeSnapshot) {
                            self.eventDispatcherService.dispatch('volumeSnapshotRemove.' + id, volumeSnapshot);
                        }
                    });
                }
                this.volumeSnapshots = state;
                break;
            case 'VolumeDataset':
                this.eventDispatcherService.dispatch('volumeDatasetsChange', state);
                state.forEach(function(volumeDataset, id){
                    if (!self.volumeDatasets || !self.volumeDatasets.has(id)) {
                        self.eventDispatcherService.dispatch('volumeDatasetAdd.' + id, volumeDataset);
                    } else if (self.volumeDatasets.get(id) !== volumeDataset) {
                        self.eventDispatcherService.dispatch('volumeDatasetChange.' + id, volumeDataset);
                    }
                });
                if (this.volumeDatasets) {
                    this.volumeDatasets.forEach(function(volumeDataset, id){
                        if (!state.has(id) || state.get(id) !== volumeDataset) {
                            self.eventDispatcherService.dispatch('volumeDatasetRemove.' + id, volumeDataset);
                        }
                    });
                }
                this.volumeDatasets = state;
                break;
            default:
                break;
        }
    }

    protected handleEvent() {}
}


