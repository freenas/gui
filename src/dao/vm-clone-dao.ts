import {AbstractDao} from './abstract-dao';
import {Model} from '../model';

export class VmCloneDao extends AbstractDao {
    public constructor() {
        super(Model.VmClone);
    }

    public clone(vmId: string, name: string) {
        return this.middlewareClient.submitTask('vm.clone', [vmId, name]);
    }
}
