import {AbstractDao} from "./abstract-dao";import {Model} from '../model';

export class DockerContainerSectionDao extends AbstractDao {
    public constructor() {
        super(Model.DockerContainerSection);
    }
}
