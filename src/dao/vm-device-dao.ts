import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class VmDeviceDao extends AbstractDao {
    public constructor() {
        super(Model.VmDevice);
    }
}
