import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
export class VmwareCredentialsDao extends AbstractDao {
    public constructor() {
        super(Model.VmwareCredentials);
    }
}
