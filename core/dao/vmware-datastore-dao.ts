import { AbstractDao } from './abstract-dao-ng';

export class VmwareDatastoreDao extends AbstractDao {

    public constructor() {
        super('VmwareDatastore', {
            queryMethod: 'vmware.get_datastore'
        });
    }

}

