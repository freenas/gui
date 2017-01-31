import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {DockerImagePull} from '../model/DockerImagePull';

export class DockerImagePullDao extends AbstractDao<DockerImagePull> {
    public constructor() {
        super(Model.DockerImagePull);
    }
}
