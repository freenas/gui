import {AbstractModelRepository} from './abstract-model-repository';
import {DockerContainerBridgeDao} from '../dao/docker-container-bridge-dao';

export class DockerContainerBridgeRepository extends AbstractModelRepository {
    private static instance: DockerContainerBridgeRepository;

    private constructor(private dockerContainerBridgeDao: DockerContainerBridgeDao) {
        super(dockerContainerBridgeDao);
    }

    public static getInstance() {
        if (!DockerContainerBridgeRepository.instance) {
            DockerContainerBridgeRepository.instance = new DockerContainerBridgeRepository(
                new DockerContainerBridgeDao()
            );
        }
        return DockerContainerBridgeRepository.instance;
    }

    public getNewDockerContainerBridge() {
        return this.dockerContainerBridgeDao.getNewInstance();
    }
}
