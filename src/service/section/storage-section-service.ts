import {AbstractSectionService} from './abstract-section-service-ng';
import {ShareRepository} from '../../repository/share-repository';
import {DiskRepository} from '../../repository/disk-repository';
import {VolumeRepository} from '../../repository/volume-repository';
import {AccountRepository} from '../../repository/account-repository';
import {CalendarRepository} from '../../repository/calendar-repository';

import {TopologyService} from '../topology-service';
import {DiskUsageService} from '../disk-usage-service';
import {PeeringService} from '../peering-service';
import {FilesystemService} from '../filesystem-service';
import {Model} from '../../model';
import {VmwareRepository} from '../../repository/vmware-repository';
import {ModelEventName} from '../../model-event-name';
import {TaskRepository} from '../../repository/task-repository';
import {PeerRepository} from '../../repository/peer-repository';
import {NetworkRepository} from '../../repository/network-repository';
import {ServiceRepository} from '../../repository/service-repository';
import {Map} from 'immutable';
import * as _ from 'lodash';
import {SubmittedTask} from '../../model/SubmittedTask';

export class StorageSectionService extends AbstractSectionService {
    private shareRepository: ShareRepository;
    private diskRepository: DiskRepository;
    private volumeRepository: VolumeRepository;
    private vmwareRepository: VmwareRepository;
    private taskRepository: TaskRepository;
    private peerRepository: PeerRepository;
    private networkRepository: NetworkRepository;
    private serviceRepository: ServiceRepository;
    private accountRepository: AccountRepository;
    private calendarRepository: CalendarRepository;
    private diskUsageService: DiskUsageService;

    private topologyService: TopologyService;

    private initialDiskAllocationPromise: Promise<any>;

    private storageOverview: any;

    private readonly DEFAULT_PERMISSIONS = {
        user: 'root',
        group: 'wheel',
        modes: {
            user: {
                read: true,
                write: true,
                execute: true
            },
            group: {
                read: true,
                write: false,
                execute: true
            },
            others: {
                read: true,
                write: false,
                execute: true
            },
        }
    };

    protected init() {
        let self = this;

        this.shareRepository = ShareRepository.getInstance();
        this.diskRepository = DiskRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
        this.vmwareRepository = VmwareRepository.getInstance();
        this.taskRepository = TaskRepository.getInstance();
        this.peerRepository = PeerRepository.getInstance();
        this.networkRepository = NetworkRepository.getInstance();
        this.serviceRepository = ServiceRepository.getInstance();
        this.topologyService = TopologyService.getInstance();
        this.accountRepository = AccountRepository.getInstance();
        this.calendarRepository = CalendarRepository.getInstance();
        this.diskUsageService = DiskUsageService.getInstance();

        this.eventDispatcherService.addEventListener(ModelEventName.Disk.listChange, this.handleDisksChange.bind(this));
        this.eventDispatcherService.addEventListener(ModelEventName.Volume.listChange, this.handleVolumesChange.bind(this));

        return this.topologyService.init();
    }

    protected loadEntries() {
        this.entries = ([] as Array<any>);
        return this.volumeRepository.listVolumes();
    }

    protected loadExtraEntries() {
        return Promise.all([
            this.volumeRepository.getVolumeImporter(),
            this.volumeRepository.getVolumeMediaImporter()
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

    protected loadSettings() {
        return undefined;
    }

    public getVdevRecommendation(redundancy, speed, storage)  {
        return this.topologyService.getVdevRecommendation(redundancy, speed, storage);
    }

    public setRootDatasetForVolume(this: StorageSectionService, volume: any) {
        return this.volumeRepository.listDatasets().then(function(datasets: Array<any>) {
            for (let dataset of datasets) {
                if (dataset.id === volume.id) {
                    return volume._rootDataset = dataset;
                }
            }
        });
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
        return this.volumeRepository.getEncryptedVolumeActionsInstance().then(function (encryptedVolumeActions: any) {
            encryptedVolumeActions.volume = volume;
            return encryptedVolumeActions;
        });
    }

    public listDisks() {
        return this.diskUsageService.listDisks();
    }

    public clearReservedDisks() {
        return this.diskRepository.clearReservedDisks();
    }

    public listAvailableDisks() {
        return this.diskUsageService.listAvailableDisks();
    }

    public findDetachedVolumes() {
        return this.volumeRepository.findDetachedVolumes();
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

    public getTopologyProxy(topology: any) {
        let pairs: Array<string|any> = _.map(VolumeRepository.TOPOLOGY_KEYS, (key) => [key, []]);
        let topologyProxy = _.fromPairs(pairs);
        _.forEach(VolumeRepository.TOPOLOGY_KEYS,
            (key) => topologyProxy[key] = this.cloneVdevs(topology[key])
        );
        return topologyProxy;
    }

    public generateTopology(disks, topologyProfile) {
        return this.topologyService.generateTopology(
            this.diskRepository.listAvailableDisks(),
            topologyProfile
        );
    }

    public getNewZfsVdev() {
        return this.volumeRepository.getNewZfsVdev();
    }

    public getVdevFromDisk(disk: any) {
        return this.isVdev(disk) ? disk : this.topologyService.diskToVdev(disk);
    }

    public isVdev(disk: any): boolean {
        return disk._objectType === Model.ZfsVdev;
    }

    public isVolumeDataset(object: any): boolean {
        return object._objectType === Model.VolumeDataset;
    }

    public updateVolumeTopology(volume: any, topology: any) {
        return this.volumeRepository.updateVolumeTopology(volume, topology);
    }

    public markDiskAsReserved(diskPath: string) {
        this.diskRepository.markDiskAsReserved(diskPath);
    }

    public markDiskAsNonReserved(diskPath: string) {
        this.diskRepository.markDiskAsNonReserved(diskPath);
    }

    public markDiskAsFreed(diskPath: string) {
        this.diskRepository.markDiskAsFreed(diskPath);
    }

    public getDiskAllocation(disk: any) {
        return this.diskRepository.getDiskAllocation(disk);
    }

    public createVolume(volume: any): Promise<SubmittedTask> {
        let password = volume._password;
        delete volume._password;
        volume.password_encrypted = !!password;
        return this.volumeRepository.createVolume(volume, password);
    }

    public scrubVolume(volume: any) {
        return this.volumeRepository.scrubVolume(volume);
    }

    public upgradeVolume(volume: any) {
        return this.volumeRepository.upgradeVolume(volume);
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

    public listImportableDisks() {
        return this.volumeRepository.listImportableDisks();
    }

    public importDisk(disk: string, path: string, fsType: string) {
        return this.volumeRepository.importDisk(disk, path, fsType);
    }

    public listVmwareDatastores(peer: any) {
        return this.vmwareRepository.listDatastores(peer);
    }

    public listNetworkInterfaces() {
        return this.networkRepository.listNetworkInterfaces();
    }

    public listServices() {
        return this.serviceRepository.listServices();
    }

    public initializeDatasetProperties(dataset: any) {
        return this.volumeRepository.initializeDatasetProperties(dataset);
    }

    public convertVolumeDatasetSizeProperties(dataset: any) {
        return this.volumeRepository.convertVolumeDatasetSizeProperties(dataset);
    }

    public ensureDefaultPermissionsAreSetOnDataset(dataset: any) {
        return (dataset.permissions ?
            Promise.resolve(dataset.permissions) :
            this.volumeRepository.getNewPermissions()).then((permissions) => {
                dataset.permissions_type = dataset.permissions_type  || 'PERM';
                dataset.permissions = _.defaults(permissions, this.DEFAULT_PERMISSIONS);
            });
    }

    public isRootDataset(dataset: any) {
        return dataset.id === dataset.volume;
    }

    public getVdev(disk: any) {
        return this.volumeRepository.getVdevFromDisk(disk);
    }

    public eraseDisk(disk: any) {
        return this.diskRepository.erase(disk);
    }

    public offlineDisk(volumeId: string, vdev: any) {
        return this.volumeRepository.offlineVdev(volumeId, vdev);
    }

    public onlineDisk(volumeId: string, vdev: any) {
        return this.volumeRepository.onlineVdev(volumeId, vdev);
    }

    public getNextSequenceForStream (streamId) {
        return this.volumeRepository.getNextSequenceForStream(streamId);
    }

    public importShares(volumeId: string) {
        return this.volumeRepository.importShares(volumeId);
    }

    public searchUser(value) {
        return this.accountRepository.searchUser(value);
    }

    public searchGroup(value) {
        return this.accountRepository.searchGroup(value);
    }

    public deleteCalendarTask(task) {
        return this.calendarRepository.deleteCalendarTask(task);
    }

    public setVolumeKey(volume, keyFile, password) {
        return this.volumeRepository.setVolumeKey(volume, keyFile, password);
    }

    private cloneVdevs(vdevs: Array<any>): Array<any> {
        return _.map(vdevs, (vdev) => {
            let clone = _.cloneDeep(vdev);
            switch (clone.type) {
                case 'disk':
                    clone.children = _.castArray(
                        _.cloneWith(vdev, (value, key) => key === 'children' ? [] : undefined)
                    );
                    break;
                default:
                    break;
            }
            return clone;
        });
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
}
