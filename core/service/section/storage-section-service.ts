import { AbstractSectionService } from './abstract-section-service-ng';
import { ShareRepository} from 'core/repository/share-repository';
import { DiskRepository} from 'core/repository/disk-repository';
import { VolumeRepository } from 'core/repository/volume-repository';

import { StorageRepository } from 'core/repository/storage-repository';
import { TopologyService } from 'core/service/topology-service';
import { PeeringService } from 'core/service/peering-service';
import { FilesystemService } from 'core/service/filesystem-service';
import { Model } from 'core/model/model';
import {VmwareRepository} from "../../repository/vmware-repository";
import {ModelEventName} from "../../model-event-name";
import {ReplicationRepository} from "../../repository/replication-repository";
import {TaskRepository} from "../../repository/task-repository";
import {Map} from "immutable";
import {PeerRepository} from "../../repository/peer-repository";

export class StorageSectionService extends AbstractSectionService {
    private shareRepository: ShareRepository;
    private diskRepository: DiskRepository;
    private volumeRepository: VolumeRepository;
    private vmwareRepository: VmwareRepository;
    private replicationRepository: ReplicationRepository;
    private taskRepository: TaskRepository;
    private peerRepository: PeerRepository;

    private topologyService: TopologyService;

    private refreshPromise: Promise<any>;

    private storageOverview: any;

    public readonly SHARE_TYPE = Model.Share;
    public readonly VOLUME_DATASET_TYPE = Model.VolumeDataset;
    public readonly VOLUME_SNAPSHOT_TYPE = Model.VolumeSnapshot;
    public readonly TOPOLOGY_TYPE = Model.ZfsTopology;
    public readonly TOPOLOGY_KEYS = VolumeRepository.TOPOLOGY_KEYS;


    protected init() {
        let self = this;

        this.shareRepository = ShareRepository.getInstance();
        this.diskRepository = DiskRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
        this.vmwareRepository = VmwareRepository.getInstance();
        this.replicationRepository = ReplicationRepository.getInstance();
        this.taskRepository = TaskRepository.getInstance();
        this.peerRepository = PeerRepository.getInstance();

        this.volumeRepository.getVdevRecommendations().then(function(vdevRecommendations) {
            self.topologyService = TopologyService.instance.init(vdevRecommendations);
        });

        this.eventDispatcherService.addEventListener(ModelEventName.Disk.listChange, this.handleDisksChange.bind(this));
        this.eventDispatcherService.addEventListener(ModelEventName.Volume.listChange, this.handleVolumesChange.bind(this));
        this.eventDispatcherService.addEventListener('topologyChange', this.refreshDiskUsage.bind(this));
    }

    protected loadEntries() {
        let self = this;
        this.entries = ([] as Array<any>);
        return this.volumeRepository.listVolumes().then(function(volumes) {
            self.refreshDiskUsage();
            return volumes;
        });
    }

    protected loadExtraEntries() {
        return Promise.all([
            this.volumeRepository.getVolumeImporter()
        ]);
    }

    protected loadOverview() {
        let self = this;
        this.storageOverview = {};
        return Promise.all([
            this.loadEntries()
        ]).then(function() {
            self.storageOverview.volumes = self.entries;
            return self.storageOverview;
        });
    }

    protected loadSettings() {}

    public setRootDatasetForVolume(this: StorageSectionService, volume: any) {
        return this.volumeRepository.listDatasets().then(function(datasets) {
            for (let dataset of datasets) {
                if (dataset.id === volume.id) {
                    return volume._rootDataset = dataset;
                }
            }
        })
    }

    public listShares() {
        return this.shareRepository.listShares();
    }

    public listSnapshots() {
        return this.volumeRepository.listSnapshots();
    }

    public listDatasets() {
        return this.volumeRepository.listDatasets();
    }

    public listVmwareDatasets() {
        return this.vmwareRepository.listDatasets();
    }

    public listPeers() {
        return this.peerRepository.listPeers();
    }

    public getEncryptedVolumeActionsForVolume(volume: Object): Promise<Object> {
        return this.volumeRepository.getEncryptedVolumeActionsInstance().then(function (encryptedVolumeActions) {
            encryptedVolumeActions.volume = volume;
            return encryptedVolumeActions;
        });
    }

    public listDisks() {
        return this.diskRepository.listDisks();
    }

    public clearReservedDisks() {
        return this.diskRepository.clearReservedDisks();
    }

    public listAvailableDisks() {
        return this.diskRepository.listAvailableDisks();
    }

    public listDetachedVolumes() {
        return this.volumeRepository.listDetachedVolumes();
    }

    public importDetachedVolume(volume: any) {
        return this.volumeRepository.importDetachedVolume(volume);
    }

    public deleteDetachedVolume(volume: any) {
        return this.volumeRepository.deleteDetachedVolume(volume);
    }

    public exportVolume(volume: any) {
        return this.volumeRepository.exportVolume(volume);
    }

    public getEncryptedVolumeImporterInstance() {
        return this.volumeRepository.getEncryptedVolumeImporterInstance();
    }

    public getNewTopology() {
        return this.volumeRepository.getTopologyInstance();
    }

    public clearTopology(topology: any) {
        return this.volumeRepository.clearTopology(topology);
    }

    public generateTopology(topology, disks, redundancy, speed, storage) {
        let self = this;
        this.clearReservedDisks();
        let vdev, j, disksLength,
            priorities = self.topologyService.generateTopology(topology, this.diskRepository.listAvailableDisks(), redundancy, speed, storage);
        for (let i = 0, vdevsLength = topology.data.length; i < vdevsLength; i++) {
            vdev = topology.data[i];
            if (Array.isArray(vdev.children)) {
                for (j = 0, disksLength = vdev.children.length; j < disksLength; j++) {
                    self.markDiskAsReserved(vdev.children[j]);
                }
            } else {
                self.markDiskAsReserved(vdev);
            }
        }
        return priorities;
    }

    public updateVolumeTopology(volume: any, topology: any) {
        return this.volumeRepository.updateVolumeTopology(volume, topology);
    }

    public markDiskAsReserved(diskId: string) {
        this.diskRepository.markDiskAsReserved(diskId);
    }

    public markDiskAsNonReserved(diskId: string) {
        this.diskRepository.markDiskAsNonReserved(diskId);
    }

    public getDiskAllocation(disk: any) {
        return this.diskRepository.getDiskAllocation(disk);
    }

    public createVolume(volume: any): Promise<void> {
        let password = volume._password && volume._password.length > 0 ? volume._password : null;
        volume.password_encrypted = !!password;
        return this.volumeRepository.createVolume(volume, password);
    }

    public scrubVolume(volume: any) {
        return this.volumeRepository.scrubVolume(volume);
    }

    public lockVolume(volume: any) {
        return this.volumeRepository.lockVolume(volume);
    }

    public unlockVolume(volume: any, password?: string) {
        return this.volumeRepository.unlockVolume(volume, password);
    }

    public rekeyVolume(volume: any, key: boolean, password?: string) {
        return this.volumeRepository.rekeyVolume(volume, key, password);
    }

    public getVolumeKey(volume: any) {
        return this.volumeRepository.getVolumeKey(volume);
    }

    public importEncryptedVolume(name: string, disks: Array<any>, key: string, password: string) {
        return this.volumeRepository.importEncryptedVolume(name, disks, key, password);
    }

    public getReplicationOptionsInstance() {
        return this.replicationRepository.getReplicationOptionsInstance();
    }

    public replicateDataset(dataset: Object, replicationOptions: Object, transportOptions: Array<Object>) {
        return this.replicationRepository.replicateDataset(dataset, replicationOptions, transportOptions);
    }

    public listImportableDisks() {
        return this.volumeRepository.listImportableDisks();
    }

    public importDisk(disk: string, path: string, fsType: string) {
        return this.volumeRepository.importDisk(disk, path, fsType);
    }

    public listVmwareDatastores(peer: any) {
        return this.vmwareRepository.listDatastores(peer);
    }

    private handleDisksChange(disks: Map<string, Map<string, any>>) {
    }

    private handleVolumesChange(volumes: Map<string, Map<string, any>>) {
        let self = this;
        volumes.forEach(function(volume) {
            // DTM
            let entry = self.findObjectWithId(self.entries, volume.get('id'));
            if (entry) {
                Object.assign(entry, volume.toJS());
            } else {
                entry = volume.toJS();
                (entry as any)._objectType = 'Volume';
                self.entries.push(entry);
            }
        });
        // DTM
        if (this.entries) {
            for (let i = this.entries.length - 1; i >= 0; i--) {
                if (!volumes.has((this.entries[i] as any).id)) {
                    this.entries.splice(i, 1);
                }
            }
        }
        this.storageOverview.volumes = this.entries;
    }

    private refreshDiskUsage() {
        let self = this,
            availablePaths;
        return this.refreshPromise ?
            this.refreshPromise :
            this.volumeRepository.getAvailableDisks().then(function (paths) {
                availablePaths = paths;
                return self.diskRepository.listDisks();
            }).then(function (disks) {
                return self.volumeRepository.getDisksAllocations(disks.map((x) => x.path));
            }).then(function (disksAllocations) {
                return self.diskRepository.updateDiskUsage(availablePaths, disksAllocations);
            }).then(function() {
                self.refreshPromise = null;
            });
    }

}
