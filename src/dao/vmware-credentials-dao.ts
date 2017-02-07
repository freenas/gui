import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {VmwareCredentials} from '../model/VmwareCredentials';
export class VmwareCredentialsDao extends AbstractDao<VmwareCredentials> {
    public constructor() {
        super(Model.VmwareCredentials);
    }
}
