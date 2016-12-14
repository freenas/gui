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
    private diskAllocations: Map<string, any>;
    private pathToId:Map<string, string>;

    private constructor(private diskDao: DiskDao) {
        super(['Disk']);
        this.reservedDisks = new Set<string>();
        this.freeDisks = [];
        this.exportedDisks = new Map<string, string>();
        this.usableDisks = [];
        this.diskAllocations = new Map<string, any>();
        this.pathToId = new Map<string, string>();
    }

    public static getInstance() {
        if (!DiskRepository.instance) {
            DiskRepository.instance = new DiskRepository(
                new DiskDao()
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

    public getDiskAllocation(disk: any) {
        if (this.diskAllocations.has(disk.path)) {
            return this.diskAllocations.get(disk.path);
        }
    }

    public updateDiskUsage(availableDisks: Array<string>, disksAllocations: Object) {
        let self = this,
            allocatedDisks = Object.keys(disksAllocations),
            exportedDisksPaths = allocatedDisks.filter((x) => disksAllocations[x].type === 'EXPORTED_VOLUME');
        this.freeDisks = this.disks.valueSeq()
            .filter((x) => availableDisks.indexOf(x.get('path')) != -1)
            .filter((x) => allocatedDisks.indexOf(x.get('path')) === -1)
            .map((x) => x.get('id'))
            .toArray();
        this.usableDisks = this.freeDisks.slice();
        this.exportedDisks = new Map<string, string>();
        for (let diskPath of exportedDisksPaths) {
            this.exportedDisks.set(diskPath, disksAllocations[diskPath].name);
            this.usableDisks.push(this.pathToId.get(diskPath));
        }
        this.diskAllocations.clear();
        this.disks.forEach(function(disk) {
            let diskPath = disk.get('path');
            if (allocatedDisks.indexOf(diskPath !== -1) {
                self.diskAllocations.set(diskPath, disksAllocations[diskPath]);
            }
        });
        this.eventDispatcherService.dispatch('availableDisksChange', this.listAvailableDisks());
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Disk':
                let self = this;
                this.pathToId.clear();
                state.forEach(function(disk, id) {
                    self.pathToId.set(disk.get('path'), id);
                });
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

