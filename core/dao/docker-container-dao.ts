import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import Promise = require("bluebird");

export class DockerContainerDao extends AbstractDao {

    public constructor() {
        super(Model.DockerContainer);
    }

    public requestInteractiveConsole(containerId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('docker.container.request_interactive_console', [containerId]);
    }

    public requestSerialConsole(containerId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('docker.container.request_serial_console', [containerId]);
    }
}
