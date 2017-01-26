import {AbstractModelRepository} from './abstract-model-repository';
import {DockerContainerLogsDao} from '../dao/docker-container-logs-dao';

export class DockerContainerLogsRepository extends AbstractModelRepository {
    private static instance: DockerContainerLogsRepository;

    private constructor(private dockerContainerLogsDao: DockerContainerLogsDao) {
        super(dockerContainerLogsDao);
    }

    public static getInstance() {
        if (!DockerContainerLogsRepository.instance) {
            DockerContainerLogsRepository.instance = new DockerContainerLogsRepository(
                new DockerContainerLogsDao()
            );
        }
        return DockerContainerLogsRepository.instance;
    }

    public getNewDockerContainerLogs() {
        return this.dockerContainerLogsDao.getNewInstance();
    }
}
