import {AbstractDao} from './abstract-dao';
import {Model} from '../model';

export class VmDatastoreDao extends AbstractDao {
    public constructor() {
        super(Model.VmDatastore);
    }
}
