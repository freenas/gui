import { AbstractRepository } from './abstract-repository-ng';
import { VolumeDao } from '../dao/volume-dao';
import { VolumeSnapshotDao } from '../dao/volume-snapshot-dao';
import { VolumeDatasetDao } from '../dao/volume-dataset-dao';
import { VolumeImporterDao } from '../dao/volume-importer-dao';
import { VolumeMediaImporterDao } from '../dao/volume-media-importer-dao';
import { EncryptedVolumeActionsDao } from '../dao/encrypted-volume-actions-dao';
import {VolumeVdevRecommendationsDao} from '../dao/volume-vdev-recommendations-dao';
import {DetachedVolumeDao} from '../dao/detached-volume-dao';
import {EncryptedVolumeImporterDao} from '../dao/encrypted-volume-importer-dao';
import {ZfsTopologyDao} from '../dao/zfs-topology-dao';
import {ModelEventName} from '../model-event-name';
import {Model} from '../model';
import {ZfsVdevDao} from '../dao/zfs-vdev-dao';
import {DatastoreService} from '../service/datastore-service';
import {VolumeDatasetPropertiesDao} from '../dao/volume-dataset-properties-dao';
import {VolumeDatasetPropertyAtimeDao} from '../dao/volume-dataset-property-atime-dao';
import {VolumeDatasetPropertyCasesensitivityDao} from '../dao/volume-dataset-property-casesensitivity-dao';
import {VolumeDatasetPropertyCompressionDao} from '../dao/volume-dataset-property-compression-dao';
import {VolumeDatasetPropertyDedupDao} from '../dao/volume-dataset-property-dedup-dao';
import {VolumeDatasetPropertyQuotaDao} from '../dao/volume-dataset-property-quota-dao';
import {VolumeDatasetPropertyRefquotaDao} from '../dao/volume-dataset-property-refquota-dao';
import {VolumeDatasetPropertyVolblocksizeDao} from '../dao/volume-dataset-property-volblocksize-dao';
import {VolumeDatasetPropertyRefreservationDao} from '../dao/volume-dataset-property-refreservation-dao';
import {VolumeDatasetPropertyReservationDao} from '../dao/volume-dataset-property-reservation-dao';

import {Map} from 'immutable';
import * as Promise from 'bluebird';
import * as bytes from 'bytes';
import * as _ from 'lodash';
import {PermissionsDao} from '../dao/permissions-dao';

export class VolumeRepository extends AbstractRepository {
    private static instance: VolumeRepository;
    private volumes: Map<string, Map<string, any>>;
    private detachedVolumes: Map<string, Map<string, any>>;
    private volumeSnapshots: Map<string, Map<string, any>>;
    private volumeDatasets: Map<string, Map<string, any>>;

    public static readonly TOPOLOGY_KEYS = ['data', 'cache', 'log', 'spare'];
    public static readonly INHERITED = 'INHERITED';
    private static readonly DEFAULT_VOLBLOCKSIZE = 512;
    private readonly DEFAULT_SOURCE_SETTING = {source: VolumeRepository.INHERITED};
    private readonly DEFAULT_VOLBLOCKSIZE_SETTING = {parsed: VolumeRepository.DEFAULT_VOLBLOCKSIZE};

    private constructor(
        private volumeDao: VolumeDao,
        private volumeSnapshotDao: VolumeSnapshotDao,
        private volumeDatasetDao: VolumeDatasetDao,
        private volumeImporterDao: VolumeImporterDao,
        private volumeMediaImporterDao: VolumeMediaImporterDao,
        private encryptedVolumeActionsDao: EncryptedVolumeActionsDao,
        private volumeVdevRecommendationsDao: VolumeVdevRecommendationsDao,
        private detachedVolumeDao: DetachedVolumeDao,
        private encryptedVolumeImporterDao: EncryptedVolumeImporterDao,
        private zfsTopologyDao: ZfsTopologyDao,
        private zfsVdevDao: ZfsVdevDao,
        private datastoreService: DatastoreService,
        private volumeDatasetPropertiesDao: VolumeDatasetPropertiesDao,
        private volumeDatasetPropertyAtimeDao: VolumeDatasetPropertyAtimeDao,
        private volumeDatasetPropertyCasesensitivityDao: VolumeDatasetPropertyCasesensitivityDao,
        private volumeDatasetPropertyCompressionDao: VolumeDatasetPropertyCompressionDao,
        private volumeDatasetPropertyDedupDao: VolumeDatasetPropertyDedupDao,
        private volumeDatasetPropertyQuotaDao: VolumeDatasetPropertyQuotaDao,
        private volumeDatasetPropertyRefquotaDao: VolumeDatasetPropertyRefquotaDao,
        private volumeDatasetPropertyVolblocksizeDao: VolumeDatasetPropertyVolblocksizeDao,
        private volumeDatasetPropertyRefreservationDao: VolumeDatasetPropertyRefreservationDao,
        private volumeDatasetPropertyReservationDao: VolumeDatasetPropertyReservationDao,
        private permissionsDao: PermissionsDao
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
                new VolumeMediaImporterDao(),
                new EncryptedVolumeActionsDao(),
                new VolumeVdevRecommendationsDao(),
                new DetachedVolumeDao(),
                new EncryptedVolumeImporterDao(),
                new ZfsTopologyDao(),
                new ZfsVdevDao(),
                DatastoreService.getInstance(),
                new VolumeDatasetPropertiesDao(),
                new VolumeDatasetPropertyAtimeDao(),
                new VolumeDatasetPropertyCasesensitivityDao(),
                new VolumeDatasetPropertyCompressionDao(),
                new VolumeDatasetPropertyDedupDao(),
                new VolumeDatasetPropertyQuotaDao(),
                new VolumeDatasetPropertyRefquotaDao(),
                new VolumeDatasetPropertyVolblocksizeDao(),
                new VolumeDatasetPropertyRefreservationDao(),
                new VolumeDatasetPropertyReservationDao(),
                new PermissionsDao()
            );
        }
        return VolumeRepository.instance;
    }

    public listVolumes(): Promise<Array<Object>> {
        return this.volumes ? Promise.resolve(this.volumes.valueSeq().toJS()) : this.volumeDao.list();
    }

    public listDatasets(): Promise<Array<Object>> {
        return this.volumeDatasets ? Promise.resolve(this.volumeDatasets.valueSeq().toJS()) : this.volumeDatasetDao.list();
    }

    public listSnapshots(): Promise<Array<Object>> {
        return this.volumeSnapshots ? Promise.resolve(this.volumeSnapshots.valueSeq().toJS()) : this.volumeSnapshotDao.list();
    }

    public getVolumeImporter(): Promise<Object> {
        return this.volumeImporterDao.get();
    }

    public getVolumeMediaImporter(): Promise<Object> {
        return this.volumeMediaImporterDao.get();
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

    public initializeDisksAllocations(diskIds: Array<string>) {
        this.volumeDao.getDisksAllocation(diskIds).then(
            (allocations) => _.forIn(allocations,
                (allocation, path) => this.setDiskAllocation(path, allocation)
            )
        );
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
        return this.volumeDao.export(volume).then(() => this.findDetachedVolumes());
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
        return this.volumeDao.importDisk(disk, path, fsType)
            .then((task) => task.taskPromise)
            .then(() => this.findDetachedVolumes());
    }

    public updateVolumeTopology(volume: any, topology: any) {
        volume.topology = this.cleanupTopology(topology);

        // FIXME: Remove once the middleware stops sending erroneous data
        if (!volume.providers_presence) {
            volume.providers_presence = 'NONE';
        }
        return this.volumeDao.save(volume);
    }

    public getNewZfsVdev() {
        return this.zfsVdevDao.getNewInstance();
    }
    public initializeDatasetProperties(dataset: any) {
        return dataset.properties ?
            Promise.resolve(dataset) :
            Promise.all([
                this.volumeDatasetPropertiesDao.getNewInstance(),
                this.volumeDatasetPropertyAtimeDao.getNewInstance(),
                this.volumeDatasetPropertyCasesensitivityDao.getNewInstance(),
                this.volumeDatasetPropertyCompressionDao.getNewInstance(),
                this.volumeDatasetPropertyDedupDao.getNewInstance(),
                this.volumeDatasetPropertyQuotaDao.getNewInstance(),
                this.volumeDatasetPropertyRefquotaDao.getNewInstance(),
                this.volumeDatasetPropertyVolblocksizeDao.getNewInstance(),
                this.volumeDatasetPropertyRefreservationDao.getNewInstance(),
                this.volumeDatasetPropertyReservationDao.getNewInstance()
            ]).spread((properties: any,
                       atime,
                       casesensitivity,
                       compression,
                       dedup,
                       quota,
                       refquota,
                       volblocksize,
                       refreservation,
                       reservation) => {
                properties.atime = _.assign(atime, this.DEFAULT_SOURCE_SETTING);
                properties.casesensitivity = _.assign(casesensitivity, this.DEFAULT_SOURCE_SETTING);
                properties.dedup = _.assign(dedup, this.DEFAULT_SOURCE_SETTING);
                properties.compression = _.assign(compression, this.DEFAULT_SOURCE_SETTING);
                properties.quota = quota;
                properties.refquota = refquota;
                properties.volblocksize = _.assign(volblocksize, this.DEFAULT_VOLBLOCKSIZE_SETTING);
                properties.refreservation = refreservation;
                properties.reservation = reservation;

                dataset.properties = properties;
            });
    }

    public convertVolumeDatasetSizeProperties(dataset: any) {
        if (dataset.type === 'FILESYSTEM') {
            dataset.properties.quota.parsed = bytes.parse(dataset.properties.quota.value);
            dataset.properties.refquota.parsed = bytes.parse(dataset.properties.refquota.value);
            dataset.properties.reservation.parsed = bytes.parse(dataset.properties.reservation.value);
            dataset.properties.refreservation.parsed = bytes.parse(dataset.properties.refreservation.value);
        } else {
            dataset.volsize = bytes.parse(dataset.volsize);
        }
    }

    // FIXME May need to be moved at a higher level (PermissionsService ?)
    public getNewPermissions() {
        return this.permissionsDao.getNewInstance();
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

    private updateVolumesDiskUsage(volumes: Map<string, Map<string, any>>, usageType: string) {
        let diskUsage: any = {};
        if (volumes) {
            volumes.forEach(
                (volume) => _.forEach(VolumeRepository.TOPOLOGY_KEYS,
                    (topologyKey) => volume.get('topology').get(topologyKey).forEach(
                        (vdev) => vdev.get('children').map((child) => child.get('path')).forEach(
                            (path) => diskUsage[path] = volume.has('name') ? volume.get('name') : volume.get('id')
                        )
                    )
                )
            );
            this.datastoreService.save(Model.DiskUsage, usageType, diskUsage);
        }
    }

    private setDiskAllocation(path, allocation: any) {
        let usageType;
        switch (allocation.type) {
            case 'VOLUME':
                usageType = 'attached';
                break;
            case 'EXPORTED_VOLUME':
                usageType = 'detached';
                break;
            case 'BOOT':
                usageType = 'boot';
                break;
        }
        let diskUsage = this.datastoreService.getState().has(Model.DiskUsage) &&
                        this.datastoreService.getState().get(Model.DiskUsage).has(usageType) ?
                            this.datastoreService.getState().get(Model.DiskUsage).get(usageType).toJS() :
                            {};
        diskUsage[path] = allocation.name || 'boot';
        this.datastoreService.save(Model.DiskUsage, usageType, diskUsage);
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
                    this.updateVolumesDiskUsage(state, 'attached');
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
                this.updateVolumesDiskUsage(this.detachedVolumes, 'detached');
                break;
            default:
                break;
        }
    }

    protected handleEvent() {}
}


