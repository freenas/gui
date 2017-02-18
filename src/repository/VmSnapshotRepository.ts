import * as uuid from 'uuid';
import {AbstractModelRepository} from './abstract-model-repository';
import {VmSnapshotDao} from '../dao/vm-snapshot-dao';
import {VmSnapshot} from '../model/VmSnapshot';

export class VmSnapshotRepository extends AbstractModelRepository<VmSnapshot> {
    private static instance: VmSnapshotRepository;

    private constructor(private vmSnapshotDao: VmSnapshotDao) {
        super(vmSnapshotDao);
    }

    public static getInstance(): VmSnapshotRepository {
        if (!VmSnapshotRepository.instance) {
            VmSnapshotRepository.instance = new VmSnapshotRepository(new VmSnapshotDao());
        }
        return VmSnapshotRepository.instance;
    }

    public snapshotVmToName(vmId: string, name: string, description: string) {
        return this.vmSnapshotDao.createSnapshot(vmId, name, description);
    }

    public getNewVmSnapshot() {
        return this.vmSnapshotDao.getNewInstance();
    }

    public rollbackToSnapshot(snapshotId: string){
        return this.vmSnapshotDao.rollbackToSnapshot(snapshotId);
    }
}
