import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {VmSnapshot} from '../model/VmSnapshot';

export class VmSnapshotDao extends AbstractDao<VmSnapshot> {
    public constructor() {
        super(Model.VmSnapshot, {
            eventName: 'entity-subscriber.vm.snapshot.changed'
        });
    }

    public createSnapshot(vmId: string, name: string, description: string) {
        return this.middlewareClient.submitTask('vm.snapshot.create', [vmId, name, description]);
    }

    public rollbackToSnapshot(snapshotId: string){
        return this.middlewareClient.submitTask('vm.snapshot.rollback', [snapshotId]);
    }
}
