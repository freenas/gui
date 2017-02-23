import {AbstractDataObject} from './AbstractDataObject';
import {DockerContainerBridge} from './DockerContainerBridge';

export class DockerContainer extends AbstractDataObject {
    primary_network_mode: string;
    bridge: DockerContainerBridge;
}
