import { AbstractDao } from './abstract-dao-ng';

export class DockerContainerDao extends AbstractDao {

    public constructor() {
        super('DockerContainer');
    }

    public requestInteractiveConsole(containerId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('docker.container.request_interactive_console', [containerId]);
    }

    public requestSerialConsole(containerId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('docker.container.request_serial_console', [containerId]);
    }
}
