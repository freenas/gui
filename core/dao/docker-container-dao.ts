import { AbstractDao } from './abstract-dao-ng';

export class DockerContainerDao extends AbstractDao {
    private static instance: DockerContainerDao;

    private constructor() {
        super(AbstractDao.Model.DockerContainer);
    }

    public static getInstance() {
        if (!DockerContainerDao.instance) {
            DockerContainerDao.instance = new DockerContainerDao();
        }
        return DockerContainerDao.instance;
    }

    public requestInteractiveConsole(containerId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('docker.container.request_interactive_console', [containerId]);
    }

    public requestSerialConsole(containerId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('docker.container.request_serial_console', [containerId]);
    }
}
