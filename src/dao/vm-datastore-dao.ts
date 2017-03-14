import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {VmDatastore} from '../model/VmDatastore';
import * as _ from 'lodash';

export class VmDatastoreDao extends AbstractDao<VmDatastore> {
    public constructor() {
        super(Model.VmDatastore, {
            eventName: 'entity-subscriber.vm.datastore.changed'
        });
    }

    public listDiskTargetsWithType(type: string, datastoreId?: string, root?: string): Promise<any> {
        return this.middlewareClient.callRpcMethod('vm.datastore.list', _.compact([type, datastoreId, root]));
    }
}
