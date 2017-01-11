import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerContainerBridgeDao extends AbstractDao {
    public constructor() {
        super(Model.DockerContainerBridge);
    }
}
