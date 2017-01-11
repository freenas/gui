import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerContainerCreatorDao extends AbstractDao {
    public constructor() {
        super(Model.DockerContainerCreator);
    }
}
