import { AbstractRepository } from './abstract-repository-ng';
import { DiskDao } from '../dao/disk-dao';
import immutable = require('immutable');
import Promise = require('bluebird');
import {Model} from '../model';
import {ModelEventName} from '../model-event-name';
import {DatastoreService} from '../service/datastore-service';
import {Map} from 'immutable';

export class DiskRepository extends AbstractRepository {
    private static instance: DiskRepository;
    private disks: Map<string, Map<string, any>>;
    private availableDisks: Map<string, Map<string, any>>;
    private diskUsage: Map<string, Map<string, any>>;

    private constructor(private diskDao: DiskDao,
                        private datastoreService: DatastoreService) {
        super([
            Model.Disk,
            Model.DiskUsage
        ]);
    }

    public static getInstance() {
        if (!DiskRepository.instance) {
            DiskRepository.instance = new DiskRepository(
                new DiskDao(),
                DatastoreService.getInstance()
            );
        }
        return DiskRepository.instance;
    }

    public listDisks(): Promise<Array<Object>> {
        return this.disks ? Promise.resolve(this.disks.valueSeq().toJS()) : this.diskDao.list();
    }

    public clearReservedDisks() {
        this.datastoreService.save(Model.DiskUsage, 'reserved', {});
    }

    public listAvailableDisks() {
        return this.availableDisks.valueSeq().toJS();
    }

    public getDiskAllocation(disk: any) {
        let allocation;
        if (this.diskUsage.has('attached') && this.diskUsage.get('attached').has(disk.path)) {
            allocation = {
                name: this.diskUsage.get('attached').get(disk.path),
                type: 'VOLUME'
            };
        } else if (this.diskUsage.has('detached') && this.diskUsage.get('detached').has(disk.path)) {
            allocation = {
                name: this.diskUsage.get('detached').get(disk.path),
                type: 'EXPORTED_VOLUME'
            };
        } else if (this.diskUsage.has('boot') && this.diskUsage.get('boot').has(disk.path)) {
            allocation = {
                type: 'BOOT'
            };
        }
        return allocation;
    }

    public markDiskAsReserved(diskPath: any) {
        let diskUsage = this.datastoreService.getState().get(Model.DiskUsage) &&
                        this.datastoreService.getState().get(Model.DiskUsage).has('reserved') ?
                            this.datastoreService.getState().get(Model.DiskUsage).get('reserved').toJS() :
                            {};
        diskUsage[diskPath] = 'temp';
        this.datastoreService.save(Model.DiskUsage, 'reserved', diskUsage);
    }

    public markDiskAsNonReserved(diskPath: any) {
        let diskUsage = this.datastoreService.getState().get(Model.DiskUsage) &&
                        this.datastoreService.getState().get(Model.DiskUsage).has('reserved') ?
                            this.datastoreService.getState().get(Model.DiskUsage).get('reserved').toJS() :
                            {};
        delete diskUsage[diskPath];
        this.datastoreService.save(Model.DiskUsage, 'reserved', diskUsage);
    }

    private getAvailableDisks(disks: Map<string, Map<string, any>>, diskUsage: Map<string, Map<string, string>>): Map<string, Map<string, any>> {
        return Map<string, Map<string, any>>(
            disks.filter((disk) =>  disk.get('online') &&
                                    !this.isDiskUsed(disk, diskUsage.get('attached')) &&
                                    !this.isDiskUsed(disk, diskUsage.get('boot')) &&
                                    !this.isDiskUsed(disk, diskUsage.get('reserved')))
        );
    }

    private isDiskUsed(disk: any, diskUsage: Map<string, string>) {
        return diskUsage && (diskUsage.has(disk.get('path')) || diskUsage.has(disk.get('id')));
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case Model.Disk:
                this.disks = this.dispatchModelEvents(this.disks, ModelEventName.Disk, state);
                break;
            case Model.DiskUsage:
                this.availableDisks = this.getAvailableDisks(this.disks, state);
                this.diskUsage = state;
                this.eventDispatcherService.dispatch('AvailableDisksChanged', this.availableDisks);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {}
}

