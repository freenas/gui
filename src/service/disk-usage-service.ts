import { DiskRepository } from '../repository/disk-repository';
import { VolumeRepository } from '../repository/volume-repository';
import { Disk } from '../model/Disk';
import * as _ from 'lodash';


export class DiskUsageService {
    private static instance: DiskUsageService;
    private initialDiskAllocationPromise: Promise<Array<Disk>>;

    private constructor(
        private diskRepository: DiskRepository = DiskRepository.getInstance(),
        private volumeRepository: VolumeRepository = VolumeRepository.getInstance()
    ) {
    }

    public static getInstance(): DiskUsageService {
        if (!DiskUsageService.instance) {
            DiskUsageService.instance = new DiskUsageService();
        }
        return DiskUsageService.instance;
    }

    public listDisks() {
        if (!this.initialDiskAllocationPromise || this.initialDiskAllocationPromise.isRejected()) {
            this.initialDiskAllocationPromise = this.diskRepository.listDisks().then(
                (disks) => {
                    return this.volumeRepository.initializeDisksAllocations((_.map(disks, 'id') as Array<string>)).then(() => disks);
                }
            );
        }
        return this.initialDiskAllocationPromise;
    }

    public listAvailableDisks() {
        return this.listDisks().then(() => this.diskRepository.listAvailableDisks());
    }
}
