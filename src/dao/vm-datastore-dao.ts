import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import * as _ from 'lodash';

export class VmDatastoreDao extends AbstractDao {
    public constructor() {
        super(Model.VmDatastore);
    }

    public listDiskTargetsWithType(type: string, datastoreId?: string): Promise<any> {
        return this.middlewareClient.callRpcMethod('vm.datastore.list', _.compact([type, datastoreId]));
    }
}
