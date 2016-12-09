import { AbstractRepository } from './abstract-repository-ng';
import { DiskDao } from 'core/dao/disk-dao';
import {ModelEventName} from "../model-event-name";

export class DiskRepository extends AbstractRepository {
    private static instance: DiskRepository;
    private disks: immutable.Map<string, Map<string, any>>;
    private reservedDisks: Set<string>;
    private freeDisks: Array<string>;
    private exportedDisks: Map<string, string>;
    private usableDisks: Array<string>;

    private constructor(private diskDao: DiskDao) {
        super(['Disk']);
        this.reservedDisks = new Set<string>();
        this.freeDisks = [];
        this.exportedDisks = new Map<string, string>();
        this.usableDisks = [];
    }

    public static getInstance() {
        if (!DiskRepository.instance) {
            DiskRepository.instance = new DiskRepository(
                DiskDao.getInstance()
            );
        }
        return DiskRepository.instance;
    }

    public listDisks(): Promise<Array<Object>> {
        return this.diskDao.list();
    }

    public listAvailableDisks() {
        return this.disks.valueSeq()
            .filter((x) => this.usableDisks.indexOf(x.get('id')) !== -1)
            .filter((x) => !this.reservedDisks.has(x.get('id')))
            .map((x) => x.toJS())
            .toArray();
    }

    public clearReservedDisks() {
        if (this.reservedDisks.size > 0) {
            this.reservedDisks = new Set<string>();
            this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
        }
    }

    public markDiskAsReserved(disk: any) {
        let diskId = this.getDiskId(disk);
        this.reservedDisks.add(diskId);
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    }

    public markDiskAsNonReserved(disk: any) {
        let diskId = this.getDiskId(disk);
        this.reservedDisks.delete(diskId);
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    }

    public updateDiskUsage(availableDisks: Array<string>, disksAllocations: Object) {
        let allocatedDisks = Object.keys(disksAllocations),
            exportedDisksIds = allocatedDisks.filter((x) => disksAllocations[x].type === 'EXPORTED_DISK');
        this.freeDisks = this.disks.valueSeq()
            .filter((x) => availableDisks.indexOf(x.get('path')) != -1)
            .filter((x) => allocatedDisks.indexOf(x.get('id')) === -1)
            .map((x) => x.get('id'))
            .toArray();
        this.usableDisks = this.freeDisks.slice();
        this.exportedDisks = new Map<string, string>();
        for (let diskId of exportedDisksIds) {
            this.exportedDisks.set(diskId, disksAllocations[diskId].name);
            this.usableDisks.push(diskId);
        }
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Disk':
                this.disks = this.dispatchModelEvents(this.disks, ModelEventName.Disk, state);
                break;
            default:
                break;
        }
    }

    private getDiskId(disk: any) {
        return disk._disk ? disk._disk.id :
            disk.id ? disk.id : disk;
    }
}

