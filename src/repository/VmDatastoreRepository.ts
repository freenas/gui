import * as uuid from 'uuid';
import {AbstractModelRepository} from './abstract-model-repository';
import {VmDatastoreDao} from '../dao/vm-datastore-dao';

export class VmDatastoreRepository extends AbstractModelRepository {
    private static instance: VmDatastoreRepository;

    private constructor(private vmDatastoreDao: VmDatastoreDao) {
        super(vmDatastoreDao);
    }

    public static getInstance(): VmDatastoreRepository {
        if (!VmDatastoreRepository.instance) {
            VmDatastoreRepository.instance = new VmDatastoreRepository(new VmDatastoreDao());
        }
        return VmDatastoreRepository.instance;
    }

    public list(): Promise<any> {
        return this.localState ? this.localState.valueSeq().toJS() : this.vmDatastoreDao.list();
    }

    public listDiskTargetsWithType(type: string): Promise<any> {
        return this.vmDatastoreDao.listDiskTargetsWithType(type);
    }

    public listDiskTargetsWithTypeInDatastore(type: string, datastoreId: string) {
        return this.vmDatastoreDao.listDiskTargetsWithType(type, datastoreId);
    }

    public getNewVmDatastoreForType(type) {
        return this.vmDatastoreDao.getNewInstance().then((datastore) => {
            datastore.id = uuid.v4();
            datastore._tmpId = type;
            datastore.type = type;
            return VmDatastoreRepository.setDatastoreDefaultProperties(datastore);
        });
    }

    private static setDatastoreDefaultProperties(datastore) {
        datastore.properties = datastore.properties || {};
        datastore.properties['%type'] = datastore.properties['%type'] || 'vm-datastore-' + datastore.type.toLowerCase();
        switch (datastore.type) {
            case 'NFS':
                datastore.properties.version = datastore.properties.version || 'NFSV3';
                break;
        }
        return datastore;
    }
}
