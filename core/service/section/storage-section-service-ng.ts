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

export class StorageSectionService extends AbstractSectionService {
    private shareRepository: ShareRepository;
    private diskRepository: DiskRepository;
    private volumeRepository: VolumeRepository;
    private vmwareRepository: VmwareRepository;

    private topologyService: TopologyService;

    private storageOverview: Object;

    public readonly SHARE_TYPE = Model.Share;
    public readonly VOLUME_DATASET_TYPE = Model.VolumeDataset;
    public readonly VOLUME_SNAPSHOT_TYPE = Model.VolumeSnapshot;
    public readonly TOPOLOGY_TYPE = Model.ZfsTopology;


    protected init() {
        let self = this;

        this.shareRepository = ShareRepository.getInstance();
        this.diskRepository = DiskRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
        this.vmwareRepository = VmwareRepository.getInstance();

        this.volumeRepository.getVdevRecommendations().then(function(vdevRecommendations) {
            self.topologyService = TopologyService.instance.init(vdevRecommendations);
        });

        this.eventDispatcherService.addEventListener(ModelEventName.Disk.listChange, this.handleDisksChange.bind(this));
        this.eventDispatcherService.addEventListener(ModelEventName.Volume.listChange, this.handleVolumesChange.bind(this));
    }

    protected loadEntries() {
        this.entries = [];
        return this.volumeRepository.listVolumes();
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

    public setRootDatasetForVolume(this: StorageSectionService, volume: Object) {
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

    public getEncryptedVolumeActionsForVolume(volume: Object): Promise<Object> {
        return this.volumeRepository.getEncryptedVolumeActionsInstance().then(function (encryptedVolumeActions) {
            encryptedVolumeActions.volume = volume;
            return encryptedVolumeActions;
        });
    }

    public clearReservedDisks() {
        return this.diskRepository.clearReservedDisks();
    }

    public listAvailableDisks() {
        return this.diskRepository.listAvailableDisks();
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

    public markDiskAsReserved(diskId: string) {
        this.diskRepository.markDiskAsReserved(diskId);
    }

    public markDiskAsNonReserved(diskId: string) {
        this.diskRepository.markDiskAsNonReserved(diskId);
    }

    public createVolume(volume: Object): Promise<void> {
        return this.volumeRepository.createVolume(volume);
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
                entry._objectType = 'Volume';
                self.entries.push(entry);
            }
        });
        // DTM
        if (this.entries) {
            for (let i = this.entries.length - 1; i >= 0; i--) {
                if (!volumes.has(this.entries[i].id)) {
                    this.entries.splice(i, 1);
                }
            }
        }
        this.storageOverview.volumes = this.entries;
        let availablePaths;
        this.volumeRepository.getAvailableDisks().then(function(paths) {
            availablePaths = paths;
            return self.diskRepository.listDisks();
        }).then(function(disks) {
            return self.volumeRepository.getDisksAllocations(disks.map((x) => x.id));
        }).then(function(disksAllocations) {
            return self.diskRepository.updateDiskUsage(availablePaths, disksAllocations);
        });
    }

}
