import {AbstractModelRepository} from './abstract-model-repository';
import {DockerContainerDao} from '../dao/docker-container-dao';

export class DockerContainerRepository extends AbstractModelRepository {
    private static instance: DockerContainerRepository;

    private constructor(private dockerContainerDao: DockerContainerDao) {
        super(dockerContainerDao);
    }

    public static getInstance(): DockerContainerRepository {
        if (!DockerContainerRepository.instance) {
            DockerContainerRepository.instance = new DockerContainerRepository(
                new DockerContainerDao()
            );
        }
        return DockerContainerRepository.instance;
    }

    public listDockerContainers() {
        return this.dockerContainerDao.list();
    }

    public getNewDockerContainer() {
        return this.dockerContainerDao.getNewInstance();
    }

    public saveContainer(container: any) {
        return this.dockerContainerDao.save(container);
    }

    public getInteractiveConsoleToken(containerId: string) {
        return this.dockerContainerDao.requestInteractiveConsole(containerId);
    }

    public getSerialConsoleToken(containerId) {
        return this.dockerContainerDao.requestSerialConsole(containerId);
    }

    public startContainer(container) {
        return this.dockerContainerDao.start(container);
    }

    public restartContainer(container) {
        return this.dockerContainerDao.restart(container);
    }

    public stopContainer(container) {
        return this.dockerContainerDao.stop(container);
    }

    public generateMacAddress() {
        return this.dockerContainerDao.generateMacAddress();
    }
}
