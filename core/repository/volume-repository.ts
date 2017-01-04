import { AbstractRepository } from './abstract-repository-ng';
import { VolumeDao } from '../dao/volume-dao';
import { VolumeSnapshotDao } from '../dao/volume-snapshot-dao';
import { VolumeDatasetDao } from '../dao/volume-dataset-dao';
import { VolumeImporterDao } from '../dao/volume-importer-dao';
import { EncryptedVolumeActionsDao } from '../dao/encrypted-volume-actions-dao';
import {VolumeVdevRecommendationsDao} from "../dao/volume-vdev-recommendations-dao";
import {DetachedVolumeDao} from "../dao/detached-volume-dao";

import {EncryptedVolumeImporterDao} from "../dao/encrypted-volume-importer-dao";
import {ZfsTopologyDao} from "../dao/zfs-topology-dao";
import {ModelEventName} from "../model-event-name";
import {Map} from "immutable";
import {Model} from "../model";
import * as Promise from "bluebird";

export class VolumeRepository extends AbstractRepository {
    private static instance: VolumeRepository;
    private volumes: Map<string, Map<string, any>>;
    private detachedVolumes: Map<string, Map<string, any>>;
    private volumeSnapshots: Map<string, Map<string, any>>;
    private volumeDatasets: Map<string, Map<string, any>>;

    public static readonly TOPOLOGY_KEYS = ["data", "cache", "log", "spare"];

    private constructor(
        private volumeDao: VolumeDao,
        private volumeSnapshotDao: VolumeSnapshotDao,
        private volumeDatasetDao: VolumeDatasetDao,
        private volumeImporterDao: VolumeImporterDao,
        private encryptedVolumeActionsDao: EncryptedVolumeActionsDao,
        private volumeVdevRecommendationsDao: VolumeVdevRecommendationsDao,
        private detachedVolumeDao: DetachedVolumeDao,
        private encryptedVolumeImporterDao: EncryptedVolumeImporterDao,
        private zfsTopologyDao: ZfsTopologyDao
    ) {
        super([
            Model.Volume,
            Model.VolumeDataset,
            Model.VolumeSnapshot,
            Model.DetachedVolume
        ]);
    }

    public static getInstance() {
        if (!VolumeRepository.instance) {
            VolumeRepository.instance = new VolumeRepository(
                new VolumeDao(),
                new VolumeSnapshotDao(),
                new VolumeDatasetDao(),
                new VolumeImporterDao(),
                new EncryptedVolumeActionsDao(),
                new VolumeVdevRecommendationsDao(),
                new DetachedVolumeDao(),
                new EncryptedVolumeImporterDao(),
                new ZfsTopologyDao()
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
        return this.volumeImporterDao.get();
    }

    public getNewVolumeSnapshot() {
        return this.volumeSnapshotDao.getNewInstance();
    }

    public getNewVolumeDataset() {
        return this.volumeDatasetDao.getNewInstance();
    }

    public getNewVolume() {
        return this.volumeDao.getNewInstance();
    }

    public getEncryptedVolumeActionsInstance(): Promise<Object> {
        return this.encryptedVolumeActionsDao.getNewInstance();
    }

    public getDisksAllocations(diskIds: Array<string>): Promise<Array<Object>> {
        return this.volumeDao.getDisksAllocation(diskIds);
    }

    public getAvailableDisks(): Promise<Array<string>> {
        return this.volumeDao.getAvailableDisks();
    }

    public getVdevRecommendations(): Promise<Object> {
        return this.volumeVdevRecommendationsDao.get();
    }

    public createVolume(volume: any, password?: string): Promise<void> {
        volume.topology = this.cleanupTopology(volume.topology);
        return this.volumeDao.save(volume, [password]);
    }

    public scrubVolume(volume: any) {
        return this.volumeDao.scrub(volume);
    }

    public upgradeVolume(volume: any) {
        return this.volumeDao.upgrade(volume);
    }

    public listDetachedVolumes() {
        return this.detachedVolumes ? Promise.resolve(this.detachedVolumes.valueSeq().toJS()) : this.findDetachedVolumes();
    }

    public findDetachedVolumes() {
        return this.detachedVolumeDao.list();
    }

    public importDetachedVolume(volume: any) {
        return this.detachedVolumeDao.import(volume);
    }

    public deleteDetachedVolume(volume: any) {
        return this.detachedVolumeDao.delete(volume);
    }

    public exportVolume(volume: any) {
        return this.volumeDao.export(volume);
    }

    public lockVolume(volume: any) {
        return this.volumeDao.lock(volume);
    }

    public unlockVolume(volume: any, password?: string) {
        return this.volumeDao.unlock(volume, password);
    }

    public rekeyVolume(volume: any, key: boolean, password?: string) {
        return this.volumeDao.rekey(volume, key, password);
    }

    public getVolumeKey(volume: any) {
        return this.volumeDao.getVolumeKey(volume);
    }

    public importEncryptedVolume(name: string, disks: Array<any>, key: string, password: string) {
        return this.volumeDao.importEncrypted(name, disks, key, password);
    }

    public getEncryptedVolumeImporterInstance() {
        return this.encryptedVolumeImporterDao.getNewInstance();
    }

    public getTopologyInstance() {
        return this.zfsTopologyDao.getNewInstance().then(function(zfsTopology) {
            for (let key of VolumeRepository.TOPOLOGY_KEYS) {
                zfsTopology[key] = [];
            }
            return zfsTopology;
        });
    }

    public clearTopology(topology: any) {
        for (let key of VolumeRepository.TOPOLOGY_KEYS) {
            topology[key] = [];
        }
        return topology;
    }

    public listImportableDisks() {
        return this.volumeDao.findMedia();
    }

    public importDisk(disk: string, path: string, fsType: string) {
        return this.volumeDao.importDisk(disk, path, fsType);
    }

    public updateVolumeTopology(volume: any, topology: any) {
        volume.topology = this.cleanupTopology(topology);

        // FIXME: Remove once the middleware stops sending erroneous data
        if (!volume.providers_presence) {
            volume.providers_presence = 'NONE';
        }
        return this.volumeDao.save(volume);
    }

    private cleanupTopology(topology: any) {
        let clean = {};
        for (let key of VolumeRepository.TOPOLOGY_KEYS) {
            if (topology[key] && topology[key].length > 0) {
                let part = [];
                for (let vdev of topology[key]) {
                    part.push(this.cleanupVdev(vdev));
                }
                clean[key] = part;
            }
        }
        return clean;
    }

    private cleanupVdev(vdev: any, isChild = false) {
        let clean;
        if (vdev.type === 'disk' || isChild) {
            clean = {
                type: 'disk'
            };
            if (!vdev.path && vdev.children && vdev.children.length === 1) {
                clean.path = vdev.children[0].path;
            } else if (vdev.path) {
                clean.path = vdev.path;
            }
        } else {
            clean = {
                type: vdev.type,
                children: []
            };
            for (let child of vdev.children) {
                clean.children.push(this.cleanupVdev(child, true));
            }
        }
        if (vdev.guid) {
            clean.guid = vdev.guid;
        }
        return clean;
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case Model.Volume:
                let self = this,
                    volumeId;
                let hasTopologyChanged = false;
                if (this.volumes) {
                    this.volumes.forEach(function(volume) {
                        volumeId = volume.get('id');
                        if (!state.has(volumeId) || volume.get('topology') !== state.get(volumeId).get('topology')) {
                            hasTopologyChanged = true;
                        }
                    });
                    if (!hasTopologyChanged) {
                        state.forEach(function(volume) {
                            volumeId = volume.get('id');
                            if (!self.volumes.has(volumeId) || volume.get('topology') !== self.volumes.get(volumeId).get('topology')) {
                                hasTopologyChanged = true;
                            }
                        });
                    }
                } else {
                    hasTopologyChanged = true;
                }
                if (hasTopologyChanged) {
                    this.eventDispatcherService.dispatch('topologyChange');
                }
                this.volumes = this.dispatchModelEvents(this.volumes, ModelEventName.Volume, state);
                break;
            case Model.VolumeSnapshot:
                this.volumeSnapshots = this.dispatchModelEvents(this.volumeSnapshots, ModelEventName.VolumeSnapshot, state);
                break;
            case Model.VolumeDataset:
                this.volumeDatasets = this.dispatchModelEvents(this.volumeDatasets, ModelEventName.VolumeDataset, state);
                break;
            case Model.DetachedVolume:
                this.detachedVolumes = this.dispatchModelEvents(this.detachedVolumes, ModelEventName.DetachedVolume, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent() {}
}


