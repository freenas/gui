import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {VmClone} from '../model/VmClone';

export class VmCloneDao extends AbstractDao<VmClone> {
    public constructor() {
        super(Model.VmClone);
    }

    public clone(vmId: string, name: string) {
        return this.middlewareClient.submitTask('vm.clone', [vmId, name]);
    }
}
