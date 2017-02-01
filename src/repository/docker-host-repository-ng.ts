import {AbstractModelRepository} from './abstract-model-repository';
import {DockerHostDao} from '../dao/docker-host-dao';

export class DockerHostRepository extends AbstractModelRepository {
    private static instance: DockerHostRepository;

    private constructor(private dockerHostDao: DockerHostDao) {
        super(dockerHostDao);
    }

    public static getInstance(): DockerHostRepository {
        if (!DockerHostRepository.instance) {
            DockerHostRepository.instance = new DockerHostRepository(
                new DockerHostDao()
            );
        }
        return DockerHostRepository.instance;
    }

    public listDockerHosts() {
        return this.dockerHostDao.list();
    }

    public getNewDockerHost() {
        return this.dockerHostDao.getNewInstance();
    }

}
