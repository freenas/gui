import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {DockerContainerCreator} from '../model/DockerContainerCreator';

export class DockerContainerCreatorDao extends AbstractDao<DockerContainerCreator> {
    public constructor() {
        super(Model.DockerContainerCreator);
    }
}
