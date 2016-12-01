import { AbstractDao } from './abstract-dao-ng';

export class VmwareDatastoreDao extends AbstractDao {
    private static instance: VmwareDatastoreDao;

    private constructor() {
        super(AbstractDao.Model.VmwareDatastore, {
            queryMethod: 'vmware.get_datastore'
        });
    }

    public static getInstance() {
        if (!VmwareDatastoreDao.instance) {
            VmwareDatastoreDao.instance = new VmwareDatastoreDao();
        }
        return VmwareDatastoreDao.instance;
    }
}

