import {AbstractModelRepository} from './abstract-model-repository';
import {DockerNetworkDao} from '../dao/docker-network-dao';

export class DockerNetworkRepository extends AbstractModelRepository {
    private static instance: DockerNetworkRepository;

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

    public connectContainerToNetwork(containerId, networkId) {
        return this.dockerNetworkDao.connectContainer(networkId, containerId);
    }

    public disconnectContainerFromNetwork(containerId, networkId) {
        return this.dockerNetworkDao.disconnectContainer(networkId, containerId);
    }
}
