import { AbstractRepository } from './abstract-repository';
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

import {Map, List} from 'immutable';
import * as bytes from 'bytes';
import * as _ from 'lodash';
import {PermissionsDao} from '../dao/permissions-dao';
import {Volume} from '../model/Volume';
import {VolumeDataset} from '../model/VolumeDataset';
import {VolumeSnapshot} from '../model/VolumeSnapshot';
import {VolumeMediaImporter} from '../model/VolumeMediaImporter';
import {VolumeImporter} from '../model/VolumeImporter';
import {EncryptedVolumeActions} from '../model/EncryptedVolumeActions';
import {VolumeVdevRecommendations} from '../model/VolumeVdevRecommendations';
import {DetachedVolume} from '../model/DetachedVolume';
import {EncryptedVolumeImporter} from '../model/EncryptedVolumeImporter';
import {ZfsTopology} from '../model/ZfsTopology';
import {ZfsVdev} from '../model/ZfsVdev';
import {VolumeDatasetProperties} from '../model/VolumeDatasetProperties';
import {VolumeDatasetPropertyAtime} from '../model/VolumeDatasetPropertyAtime';
import {VolumeDatasetPropertyCasesensitivity} from '../model/VolumeDatasetPropertyCasesensitivity';
import {VolumeDatasetPropertyDedup} from '../model/VolumeDatasetPropertyDedup';
import {VolumeDatasetPropertyCompression} from '../model/VolumeDatasetPropertyCompression';
import {VolumeDatasetPropertyVolblocksize} from '../model/VolumeDatasetPropertyVolblocksize';
import {VolumeProvidersPresence} from '../model/enumerations/VolumeProvidersPresence';
import {SubmittedTask} from '../model/SubmittedTask';

export class VolumeRepository extends AbstractRepository<Volume> {
    private static instance: VolumeRepository;
    private volumes: Map<string, Map<string, any>>;
    private detachedVolumes: Map<string, Map<string, any>>;
    private volumeSnapshots: Map<string, Map<string, any>>;
    private volumeDatasets: Map<string, Map<string, any>>;
    private snapshotsStreamIds: Map<any, string>;

    public static readonly TOPOLOGY_KEYS = ['data', 'cache', 'log', 'spare'];
    public static readonly INHERITED = 'INHERITED';
    private static readonly DEFAULT_VOLSIZE = 8589934592;
    private static readonly DEFAULT_VOLBLOCKSIZE = 16384;
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
        this.snapshotsStreamIds = Map<any, string>();
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

    public listVolumes(): Promise<Array<Volume>> {
        return this.volumes ? Promise.resolve(this.volumes.valueSeq().toJS()) : this.volumeDao.list();
    }

    public listDatasets(): Promise<Array<VolumeDataset>> {
        return this.volumeDatasets ? Promise.resolve(this.volumeDatasets.valueSeq().toJS()) : this.volumeDatasetDao.list();
    }

    public listSnapshots(): Promise<Array<VolumeSnapshot>> {
        return this.volumeSnapshots ? Promise.resolve(this.volumeSnapshots.valueSeq().toJS()) : this.volumeSnapshotDao.list();
    }

    public streamSnapshots(criteria?: any): Promise<Array<VolumeSnapshot>> {
        let promise;

        if (this.snapshotsStreamIds.has(criteria)) {
            promise = Promise.resolve(
                this.datastoreService.getState().get('streams').get(this.snapshotsStreamIds.get(criteria))
            );
        } else {
            promise = this.volumeSnapshotDao.stream(true, criteria);
        }

        return promise.then((stream) => {
            let dataArray = stream.get('data').toJS();

            this.volumeSnapshotDao.register();
            this.snapshotsStreamIds = this.snapshotsStreamIds.set(criteria, stream.get('streamId'));
            dataArray._objectType = this.volumeSnapshotDao.objectType;

            // FIXME!!
            // DTM
            dataArray._stream = stream;

            return dataArray;
        });
    }

    public getVolumeImporter(): Promise<VolumeImporter> {
        return this.volumeImporterDao.get();
    }

    public getVolumeMediaImporter(): Promise<VolumeMediaImporter> {
        return this.volumeMediaImporterDao.get();
    }

    public getNewVolumeSnapshot(): Promise<VolumeSnapshot> {
        return this.volumeSnapshotDao.getNewInstance();
    }

    public getNewVolumeDataset(): Promise<VolumeDataset> {
        return this.volumeDatasetDao.getNewInstance();
    }

    public getNewVolume(): Promise<Volume> {
        return this.volumeDao.getNewInstance();
    }

    public getEncryptedVolumeActionsInstance(): Promise<EncryptedVolumeActions> {
        return this.encryptedVolumeActionsDao.getNewInstance();
    }

    public getEncryptedVolumeActionsForVolume(volumeId: string): Promise<EncryptedVolumeActions> {
        return Promise.all([
            this.encryptedVolumeActionsDao.getNewInstance(),
            this.listVolumes()
        ]).spread((encryptedVolumeActions, volumes) => {
            encryptedVolumeActions.volume = _.find(volumes, {id: volumeId});
            return encryptedVolumeActions;
        });
    }

    public initializeDisksAllocations(diskIds: Array<string>): Promise<Array<any>> {
        return this.volumeDao.getDisksAllocation(diskIds).then(
            (allocations) => _.forIn(allocations, (allocation, path) => this.setDiskAllocation(path, allocation)
            )
        );
    }

    public getVdevRecommendations(): Promise<VolumeVdevRecommendations> {
        return this.volumeVdevRecommendationsDao.get();
    }

    public createVolume(volume: any, password?: string): Promise<SubmittedTask> {
        volume.topology = this.cleanupTopology(volume.topology);
        return this.volumeDao.save(volume, [password]);
    }

    public scrubVolume(volume: Volume) {
        return this.volumeDao.scrub(volume);
    }

    public upgradeVolume(volume: Volume) {
        return this.volumeDao.upgrade(volume);
    }

    public listDetachedVolumes(): Promise<Array<DetachedVolume>> {
        return this.detachedVolumes ? Promise.resolve(this.detachedVolumes.valueSeq().toJS()) : this.findDetachedVolumes();
    }

    public findDetachedVolumes(): Promise<Array<DetachedVolume>> {
        return this.detachedVolumeDao.list();
    }

    public importDetachedVolume(volume: DetachedVolume) {
        return this.detachedVolumeDao.import(volume);
    }

    public deleteDetachedVolume(volume: DetachedVolume) {
        return this.detachedVolumeDao.delete(volume);
    }

    public exportVolume(volume: Volume) {
        return this.volumeDao.export(volume).then(() => this.findDetachedVolumes());
    }

    public lockVolume(volume: Volume) {
        return this.volumeDao.lock(volume);
    }

    public unlockVolume(volume: Volume, password?: string) {
        return this.volumeDao.unlock(volume, password);
    }

    public rekeyVolume(volume: Volume, key: boolean, password?: string) {
        return this.volumeDao.rekey(volume, key, password);
    }

    public getVolumeKey(volume: Volume) {
        return this.volumeDao.getVolumeKey(volume);
    }

    public importEncryptedVolume(name: string, disks: Array<any>, key: string, password: string) {
        return this.volumeDao.importEncrypted(name, disks, key, password);
    }

    public getEncryptedVolumeImporterInstance(): Promise<EncryptedVolumeImporter> {
        return this.encryptedVolumeImporterDao.getNewInstance();
    }

    public getTopologyInstance(): Promise<ZfsTopology> {
        return this.zfsTopologyDao.getNewInstance().then(function(zfsTopology) {
            for (let key of VolumeRepository.TOPOLOGY_KEYS) {
                zfsTopology[key] = [];
            }
            return zfsTopology;
        });
    }

    public clearTopology(topology: ZfsTopology) {
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

    public importShares(volumeId) {
        return this.volumeDao.importShares(volumeId);
    }

    public updateVolumeTopology(volume: Volume, topology: ZfsTopology) {
        volume.topology = this.cleanupTopology(topology);

        // FIXME: Remove once the middleware stops sending erroneous data
        if (!volume.providers_presence) {
            volume.providers_presence = VolumeProvidersPresence.NONE;
        }
        return this.volumeDao.save(volume);
    }

    public getNewZfsVdev(): Promise<ZfsVdev> {
        return this.zfsVdevDao.getNewInstance();
    }
    public initializeDatasetProperties(dataset: VolumeDataset): Promise<VolumeDataset> {
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
            ]).spread((properties: VolumeDatasetProperties,
                       atime,
                       casesensitivity,
                       compression,
                       dedup,
                       quota,
                       refquota,
                       volblocksize,
                       refreservation,
                       reservation) => {
                properties.atime = (_.assign(atime, this.DEFAULT_SOURCE_SETTING) as VolumeDatasetPropertyAtime);
                properties.casesensitivity = (_.assign(casesensitivity, this.DEFAULT_SOURCE_SETTING) as VolumeDatasetPropertyCasesensitivity);
                properties.dedup = (_.assign(dedup, this.DEFAULT_SOURCE_SETTING) as VolumeDatasetPropertyDedup);
                properties.compression = (_.assign(compression, this.DEFAULT_SOURCE_SETTING) as VolumeDatasetPropertyCompression);
                properties.quota = quota;
                properties.refquota = refquota;
                properties.volblocksize = (_.assign(volblocksize, this.DEFAULT_VOLBLOCKSIZE_SETTING) as VolumeDatasetPropertyVolblocksize);
                properties.refreservation = refreservation;
                properties.reservation = reservation;
                dataset.volsize = VolumeRepository.DEFAULT_VOLSIZE;

                dataset.properties = properties;
            });
    }

    public convertVolumeDatasetSizeProperties(dataset: VolumeDataset) {
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

    public getVdevFromDisk(disk: any) {
        return _.find(
            _.flatten(_.map(
                _.flatten(_.filter(
                    _.values(this.volumes.get(disk._allocation.name).get('topology').toJS()),
                    (x: any) => x.length
                )),
                (vdev: any) => vdev.path ? vdev : vdev.children
            )),
            {path: disk.path}
        );
    }

    public offlineVdev(volumeId: string, vdev: ZfsVdev) {
        return this.volumeDao.offlineVdev(volumeId, vdev);
    }

    public onlineVdev(volumeId: string, vdev: ZfsVdev) {
        return this.volumeDao.onlineVdev(volumeId, vdev);
    }

    public setVolumeKey(volume: Volume, keyFile: File, password: string) {
        return this.volumeDao.setVolumeKey(volume, keyFile, password);
    }

    private cleanupTopology(topology: ZfsTopology): ZfsTopology {
        let clean = new ZfsTopology();
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

    private cleanupVdev(vdev: ZfsVdev, isChild = false) {
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
                type: vdev.type || vdev._defaultType,
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
            volumes.forEach((volume) =>
                VolumeRepository.getVolumeDisks(volume).forEach(diskId =>
                    diskUsage[diskId] = volume.has('name') ? volume.get('name') : volume.get('id')
                )
            );
            this.datastoreService.save(Model.DiskUsage, usageType, diskUsage);
        }
    }

    private static getVolumeDisks(volumeMap: any): List<any> {
        let results: List<any>;
        if (volumeMap.has('disks')) {
            results = volumeMap.get('disks');
        } else {
            results = volumeMap.get('topology').map(vdevs =>
                vdevs.map(vdev =>
                    (!vdev.get('children') || vdev.get('children').size === 0) ? vdev.path : vdev.get('children').map(child => child.disk_id)
                )
            );
        }
        return results;
    }

    private setDiskAllocation(path: string, allocation: any) {
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
        return this.datastoreService.save(Model.DiskUsage, usageType, diskUsage);
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
                            self.eventDispatcherService.dispatch('VolumeTopologyChanged-' + volumeId, state.has(volumeId) && state.get(volumeId).get('topology'));
                            hasTopologyChanged = true;
                        }
                    });
                    if (!hasTopologyChanged) {
                        state.forEach(function(volume) {
                            volumeId = volume.get('id');
                            if (!self.volumes.has(volumeId) || volume.get('topology') !== self.volumes.get(volumeId).get('topology')) {
                                self.eventDispatcherService.dispatch('VolumeTopologyChanged-' + volumeId, volume.get('topology'));
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

    public getNextSequenceForStream(streamId: string) {
        return this.volumeSnapshotDao.getNextSequenceForStream(streamId);
    }
}


