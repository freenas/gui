import {AbstractModelRepository} from './abstract-model-repository';
import {NetworkInterface} from '../model/NetworkInterface';
import {NetworkInterfaceDao} from '../dao/network-interface-dao';

export class NetworkInterfaceRepository extends AbstractModelRepository<NetworkInterface> {
    private static instance: NetworkInterfaceRepository;

    private constructor(private networkInterfaceDao: NetworkInterfaceDao) {
        super(networkInterfaceDao);
    }

    public static getInstance() {
        if (!NetworkInterfaceRepository.instance) {
            NetworkInterfaceRepository.instance = new NetworkInterfaceRepository(
                new NetworkInterfaceDao()
            );
        }
        return NetworkInterfaceRepository.instance;
    }

    public getNewInterfaceWithType(interfaceType) {
        return Promise.all([
            this.networkInterfaceDao.getNewInstance(),
            this.modelDescriptorService.getDaoForType(interfaceType.properties.objectType).then(function(dao) {
                return dao.getNewInstance();
            })
        ]).spread(function (newInterface, properties) {
            newInterface._isNewObject = true;
            newInterface._tmpId = interfaceType.type;
            newInterface.type = interfaceType.type.toUpperCase();
            newInterface.aliases = [];
            newInterface.name = '';
            newInterface[interfaceType.type] = properties;
            return newInterface;
        });
    }

    public renew(networkInterface: NetworkInterface) {
        return this.networkInterfaceDao.renew(networkInterface);
    }
}
