import {AbstractDao} from './abstract-dao';import {Model} from '../model';
import {DockerContainerBridge} from '../model/DockerContainerBridge';

export class DockerContainerBridgeDao extends AbstractDao<DockerContainerBridge> {
    public constructor() {
        super(Model.DockerContainerBridge);
    }
}
