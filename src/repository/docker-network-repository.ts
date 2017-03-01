import {AbstractModelRepository} from './abstract-model-repository';
import {DockerNetworkDao} from '../dao/docker-network-dao';
import {DockerNetwork} from '../model/DockerNetwork';

export class DockerNetworkRepository extends AbstractModelRepository<DockerNetwork> {
    private static instance: DockerNetworkRepository;

    public static readonly PRIMARY_NETWORK_MODES = [
        {label: 'Bridged', value: 'BRIDGED'},
        {label: 'NAT', value: 'NAT'},
        {label: 'Host', value: 'HOST'},
        {label: 'None', value: 'NONE'}
    ];

    private constructor(private dockerNetworkDao: DockerNetworkDao) {
        super(dockerNetworkDao);
    }

    public static getInstance(): DockerNetworkRepository {
        if (!DockerNetworkRepository.instance) {
            DockerNetworkRepository.instance = new DockerNetworkRepository(
                new DockerNetworkDao()
            );
        }
        return DockerNetworkRepository.instance;
    }

    public getNewDockerNetwork() {
        return this.dockerNetworkDao.getNewInstance();
    }

    public listDockerNetworks() {
        return this.dockerNetworkDao.list();
    }

    public saveDockerNetwork(dockerNetwork: any) {
        return this.dockerNetworkDao.save(dockerNetwork);
    }

    public findNetworkWithName(name: string) {
        return this.dockerNetworkDao.find({name: name});
    }

    public connectContainersToNetwork(containersIds, networkId) {
        return this.dockerNetworkDao.connect(networkId, containersIds);
    }

    public disconnectContainersFromNetwork(containersIds, networkId) {
        return this.dockerNetworkDao.disconnect(networkId, containersIds);
    }
}
