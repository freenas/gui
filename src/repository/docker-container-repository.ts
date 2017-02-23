import {AbstractModelRepository} from './abstract-model-repository';
import {DockerContainerDao} from '../dao/docker-container-dao';
import {DockerContainerBridgeRepository} from './docker-container-bridge-repository';
import {DockerContainer} from '../model/DockerContainer';

export class DockerContainerRepository extends AbstractModelRepository<DockerContainer> {
    private static instance: DockerContainerRepository;
    private dockerContainerBridgeRepository: DockerContainerBridgeRepository;

    private constructor(private dockerContainerDao: DockerContainerDao) {
        super(dockerContainerDao);

        this.dockerContainerBridgeRepository = DockerContainerBridgeRepository.getInstance();
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
        return this.dockerContainerDao.getNewInstance().then((container) => {
            container.primary_network_mode = 'NAT';

            return this.dockerContainerBridgeRepository.getNewDockerContainerBridge().then(function(bridge) {
                container.bridge = bridge;
                return container;
            });
        });
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
