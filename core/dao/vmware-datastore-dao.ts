import { AbstractDao } from './abstract-dao';
import Promise = require("bluebird");
import _ = require("lodash");

export class VmwareDatastoreDao extends AbstractDao {

    public constructor() {
        super('VmwareDatastore');
    }

    public list(peer: any): Promise<Array<any>> {
        return this.middlewareClient.callRpcMethod('vmware.get_datastores', [
            peer.credentials.address,
            peer.credentials.username,
            peer.credentials.password,
            false
        ]).then((datastores) => _.forEach(datastores, (datastore) => datastore._objectType = 'VmwareDatastore'));
    }

}

