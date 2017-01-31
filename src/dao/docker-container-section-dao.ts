import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {DockerContainerSection} from '../model/DockerContainerSection';

export class DockerContainerSectionDao extends AbstractDao<DockerContainerSection> {
    public constructor() {
        super(Model.DockerContainerSection);
    }
}
