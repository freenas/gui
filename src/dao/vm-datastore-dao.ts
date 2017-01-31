import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {VmDatastore} from '../model/VmDatastore';

export class VmDatastoreDao extends AbstractDao<VmDatastore> {
    public constructor() {
        super(Model.VmDatastore);
    }
}
